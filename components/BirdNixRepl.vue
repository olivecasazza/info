<template>
  <div class="bird-nix-repl bg-black/60 border border-gray-700 rounded-md p-3">
    <div ref="termEl" class="w-full h-64" />
    <p v-if="status" class="text-xs text-gray-500 mt-2">{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Strategy for the content-hashed wasm filename:
// Fetch /bird-nix-playground/index.html, extract the `modulepreload` href, then
// dynamic-import it with a vite-ignore hint so Vite doesn't try to resolve it
// at build time. This tracks the hash automatically on every bird-nix rebuild.

const termEl = ref<HTMLDivElement | null>(null)
const status = ref('loading wasm...')

type NixEval = (code: string) => string
let term: any = null
let fitAddon: any = null
let disposeKey: { dispose: () => void } | null = null

const BIRDS = ['I', 'M', 'K', 'KI', 'B', 'C', 'L', 'W', 'S', 'V', 'Y']
const PROMPT = 'λ '

async function resolvePlaygroundJs(): Promise<string> {
  const res = await fetch('/bird-nix-playground/index.html', { cache: 'no-cache' })
  const html = await res.text()
  const m = html.match(/bird-playground-[a-f0-9]+\.js/)
  if (!m) throw new Error('could not find bird-playground JS filename in index.html')
  return `/bird-nix-playground/${m[0]}`
}

onMounted(async () => {
  if (!termEl.value) return
  const xterm = await import('@xterm/xterm')
  const fitMod = await import('@xterm/addon-fit')
  await import('@xterm/xterm/css/xterm.css')

  term = new xterm.Terminal({
    fontFamily: '"Courier New", Courier, monospace',
    fontSize: 13,
    cursorBlink: true,
    theme: { background: '#000000', foreground: '#d1d5db', cursor: '#f0dd7d' },
    convertEol: true,
  })
  fitAddon = new fitMod.FitAddon()
  term.loadAddon(fitAddon)
  term.open(termEl.value)
  fitAddon.fit()
  window.addEventListener('resize', () => fitAddon && fitAddon.fit())

  term.writeln('bird-nix REPL — real Nix via tvix-eval (wasm)')
  term.writeln(`birds in scope: ${BIRDS.join(' ')}`)
  term.writeln('try: B (x: x + 1) (y: y * 2) 3   (I M K KI B C L W S V Y are already in scope)')
  term.writeln('')

  let nixEval: NixEval | null = null
  try {
    const jsUrl = await resolvePlaygroundJs()
    const mod: any = await import(/* @vite-ignore */ jsUrl)
    const wasmUrl = jsUrl.replace(/\.js$/, '_bg.wasm')
    await mod.default({ module_or_path: wasmUrl })
    nixEval = mod.nix_eval as NixEval
    status.value = ''
    term.writeln('\x1b[32m[wasm ready]\x1b[0m')
  } catch (e: any) {
    status.value = `failed to load wasm: ${e?.message ?? e}`
    term.writeln(`\x1b[31m[wasm failed: ${e?.message ?? e}]\x1b[0m`)
  }

  let buffer = ''
  const writePrompt = () => term.write(`\x1b[33m${PROMPT}\x1b[0m`)
  writePrompt()

  disposeKey = term.onKey(({ key, domEvent }: { key: string; domEvent: KeyboardEvent }) => {
    const ev = domEvent
    if (ev.key === 'Enter') {
      term.write('\r\n')
      const src = buffer.trim()
      buffer = ''
      if (!src) return writePrompt()
      if (!nixEval) { term.writeln('\x1b[31m[wasm not ready]\x1b[0m'); return writePrompt() }
      try {
        const raw = nixEval(src)
        const r = JSON.parse(raw)
        if (r.ok) term.writeln(`\x1b[32m${r.value}\x1b[0m`)
        else term.writeln(`\x1b[31m${r.error}\x1b[0m`)
      } catch (e: any) {
        term.writeln(`\x1b[31m${e?.message ?? e}\x1b[0m`)
      }
      writePrompt()
    } else if (ev.key === 'Backspace') {
      if (buffer.length > 0) { buffer = buffer.slice(0, -1); term.write('\b \b') }
    } else if (ev.ctrlKey && ev.key.toLowerCase() === 'c') {
      buffer = ''
      term.write('^C\r\n')
      writePrompt()
    } else if (key && key.length === 1 && key.charCodeAt(0) >= 0x20) {
      buffer += key
      term.write(key)
    }
  })
})

onBeforeUnmount(() => {
  disposeKey?.dispose()
  term?.dispose()
})
</script>
