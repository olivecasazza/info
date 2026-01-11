// Central registry for Rust/WASM projects that can be used as a background.
//
// Goals:
// - Allow BackgroundWrapper to pick a random project for non-project pages.
// - Allow project pages (/projects/<slug>) to force-load a specific project.
// - Make it easy to add more projects later by adding entries here.
//
// Each project must export (from wasm-pack pkg output):
// - default async init() function
// - WebHandle class (with start/destroy/etc)
//
export type WasmProjectSlug = string

export interface WasmProjectDefinition {
  slug: WasmProjectSlug
  title: string
  // Dynamic import keeps initial JS bundle smaller and avoids eagerly loading wasm.
  // eslint-disable-next-line @typescript-eslint/ban-types
  loader: () => Promise<{ default: () => Promise<unknown>; WebHandle: new () => any }>
}

export const WASM_PROJECTS: WasmProjectDefinition[] = [
  {
    slug: 'flock',
    title: 'Flocking',
    // Explicit .js extension avoids Vite/Nuxt dynamic-import resolution edge cases.
    loader: () => import('~/wasm/flock/pkg/flock.js')
  },
  {
    slug: 'pipedream',
    title: 'Pipedream',
    // Explicit .js extension avoids Vite/Nuxt dynamic-import resolution edge cases.
    loader: () => import('~/wasm/pipedream/pkg/pipedream.js')
  }
]

export function getWasmProjectBySlug (slug: WasmProjectSlug): WasmProjectDefinition {
  const project = WASM_PROJECTS.find(p => p.slug === slug)
  if (!project) {
    throw new Error(`Unknown wasm project slug: ${slug}`)
  }
  return project
}

export function getWasmProjectSlugFromRoutePath (path: string): string | null {
  const match = path.match(/^\/projects\/([^/]+)\/?$/)
  const slug = match?.[1] ?? null
  if (!slug) { return null }
  return WASM_PROJECTS.some(p => p.slug === slug) ? slug : null
}

export function isWasmProjectRoutePath (path: string): boolean {
  return getWasmProjectSlugFromRoutePath(path) !== null
}
