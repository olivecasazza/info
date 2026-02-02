import wasmPack from 'vite-plugin-wasm-pack'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Disable SSR - WASM only works client-side anyway
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts'
  ],
  typescript: {
    shim: false
  },
  vite: {
    plugins: [
      wasmPack(['./wasm/flock', './wasm/pipedream', './wasm/spot'])
    ],
    // Allow serving files from wasm/spot/assets during dev
    server: {
      fs: {
        allow: ['..']
      }
    }
  },
  // Serve local WASM assets during development
  nitro: {
    publicAssets: [
      { dir: 'wasm/spot/assets', baseURL: '/spot-assets', maxAge: 0 }
    ]
  }
})
