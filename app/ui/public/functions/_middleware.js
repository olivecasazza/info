// Cloudflare Pages Functions middleware for the "info" project.
//
// The custom domain spot.casazza.io is attached to this same Pages project as
// casazza.io, so by default it serves the info site root. We want the bare
// spot.casazza.io host to land directly on the Spot gym instead, while
// casazza.io (and every other host) keeps serving the info site unchanged.
//
// Only the bare root path ("/") on the spot host is redirected. Asset paths
// (/shell, /spot-pkg-fix16, /spot-assets, ...) and /spot-gym/ itself MUST fall
// through untouched — the gym's wasm bundle references those at the site root,
// so redirecting them would hand back HTML instead of JS/wasm and break the gym
// on exactly the host the redirect exists for.
export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "spot.casazza.io" && url.pathname === "/") {
    // 302, preserving the query string so ?policy=... still reaches the gym.
    return Response.redirect(
      `https://spot.casazza.io/spot-gym/${url.search}`,
      302,
    );
  }

  return context.next();
}
