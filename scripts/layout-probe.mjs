#!/usr/bin/env node
// Layout probe: drives a headless Chrome over CDP and checks, at several
// viewport sizes, the layout failures that only appear at some sizes —
// a frame that does not fill its container, a frame that collapsed to zero
// height, a label that overflows a clipped row, an image whose asset is
// missing, and a page wider than the viewport.
//
// Usage:
//   nix develop --command node scripts/layout-probe.mjs --url http://127.0.0.1:4055
//
// Exits non-zero and prints one line per failure. The server must already be
// running (`trunk serve`, `dx serve`, or the deployed site).

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
}
const base = (args.get("url") ?? "http://127.0.0.1:4055").replace(/\/$/, "");
const routes = (args.get("routes") ?? [
  "/",
  "/src/panel-kit",
  "/projects/notebooks/kinematics",
  "/projects/notebooks/inverse-kinematic-approximations",
  "/projects/notebooks/wigglystuff",
].join(",")).split(",");
const sizes = (args.get("sizes") ?? ["420x800", "760x900", "1180x900", "1600x1000"].join(","))
  .split(",")
  .map((pair) => pair.split("x").map(Number));

// Elements whose overflow is intentional: an enlarged pointer target, a
// scroll container, an SVG canvas that clips by design.
const IGNORE = "svg *, .light, .resize, .pk-tr-canvas, .pk-ag-canvas, .pk-tr-rail-canvas, .ap-player *";

const chrome = process.env.CHROME ?? "/usr/bin/chromium";
const wanted = Number(args.get("cdp-port") ?? 0);
const { spawn } = await import("node:child_process");
const { mkdtempSync } = await import("node:fs");
const { tmpdir } = await import("node:os");
const { join } = await import("node:path");
const child = spawn(chrome, [
  "--headless=new",
  `--remote-debugging-port=${wanted}`,
  "--no-first-run",
  "--no-default-browser-check",
  `--user-data-dir=${mkdtempSync(join(tmpdir(), "layout-probe-"))}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

// Chrome prints the endpoint it bound; reading it means the probe never
// collides with another debugger on a guessed port.
const endpoint = await new Promise((resolve, reject) => {
  let buffer = "";
  const timer = setTimeout(() => reject(new Error("chrome did not announce a DevTools endpoint")), 30000);
  child.stderr.on("data", (chunk) => {
    buffer += chunk.toString();
    const match = buffer.match(/DevTools listening on ws:\/\/[^\s]+:(\d+)\//);
    if (match) {
      clearTimeout(timer);
      resolve(Number(match[1]));
    }
  });
  child.on("exit", (code) => reject(new Error(`chrome exited (${code}): ${buffer.slice(-400)}`)));
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function target() {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const list = await fetch(`http://127.0.0.1:${endpoint}/json/list`).then((r) => r.json());
      const page = list.find((entry) => entry.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error(`chrome exposed no page target on ${endpoint}`);
}

const socket = new WebSocket(await target());
await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
let nextId = 1;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const waiter = pending.get(message.id);
  if (waiter) {
    pending.delete(message.id);
    message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result);
  }
});
function send(method, params = {}) {
  const id = nextId++;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

await send("Page.enable");
await send("Runtime.enable");

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text ?? "evaluate failed");
  return result.result.value;
}

/** What one page reports about its own layout. */
const AUDIT = `(() => {
  const ignore = ${JSON.stringify(IGNORE)};
  const failures = [];
  const name = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : "");
  const px = (value) => parseFloat(value) || 0;

  for (const frame of document.querySelectorAll("iframe")) {
    const box = frame.getBoundingClientRect();
    const parent = frame.parentElement;
    const rect = parent.getBoundingClientRect();
    const style = getComputedStyle(parent);
    const innerW = rect.width - px(style.paddingLeft) - px(style.paddingRight);
    const innerH = rect.height - px(style.paddingTop) - px(style.paddingBottom);
    const alone = parent.children.length === 1;
    const src = frame.getAttribute("src") || "?";
    // Width is the unambiguous contract: a frame spans its container's content
    // box. Height is too, but only when nothing shares the column; shared, the
    // frame must not collapse and must not overflow.
    if (box.height < 24) failures.push(\`collapsed frame \${Math.round(box.width)}x\${Math.round(box.height)} (\${src})\`);
    else if (Math.abs(box.width - innerW) > 4) failures.push(\`frame \${Math.round(box.width)} wide in \${Math.round(innerW)} (\${src})\`);
    else if (alone && Math.abs(box.height - innerH) > 4) failures.push(\`frame \${Math.round(box.height)} tall in \${Math.round(innerH)} (\${src})\`);
    else if (box.height > innerH + 4) failures.push(\`frame overflows \${Math.round(box.height)}>\${Math.round(innerH)} (\${src})\`);
  }

  // Content wider than the box that clips it: the reader loses text with no
  // ellipsis and no scrollbar.
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("iframe") || el.matches(ignore) || !el.clientWidth) continue;
    if (el.scrollWidth <= el.clientWidth + 2) continue;
    const style = getComputedStyle(el);
    if (style.overflowX !== "hidden" && style.overflowX !== "clip") continue;
    if (style.textOverflow === "ellipsis") continue;
    failures.push(\`clipped \${name(el)} \${el.scrollWidth}>\${el.clientWidth}\`);
  }

  // An image whose asset never loaded renders as a broken glyph.
  for (const image of document.querySelectorAll("img")) {
    if (image.complete && image.naturalWidth === 0) failures.push(\`broken image \${image.getAttribute("src")}\`);
  }

  const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  if (overflow > 1) failures.push(\`page wider than viewport by \${overflow}px\`);

  return [...new Set(failures)];
})()`;

let failures = 0;
const seen = new Set();

for (const [width, height] of sizes) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  for (const route of routes) {
    await send("Page.navigate", { url: base + route });
    await sleep(Number(args.get("settle") ?? 2500));
    let report;
    try {
      report = await evaluate(AUDIT);
    } catch (error) {
      console.error(`${width}x${height} ${route}: probe failed: ${error.message}`);
      failures++;
      continue;
    }
    for (const line of report) {
      const key = `${line} @ ${route}`;
      if (seen.has(key)) continue;
      seen.add(key);
      console.log(`${width}x${height} ${route}: ${line}`);
      failures++;
    }
  }
}

socket.close();
child.kill();
console.log(`${failures} layout failure(s) across ${routes.length} route(s) and ${sizes.length} size(s)`);
process.exit(failures ? 1 : 0);
