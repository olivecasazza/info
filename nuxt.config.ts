import wasmPack from 'vite-plugin-wasm-pack'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      wasmPack(['./wasm/flock', './wasm/pipedream'])
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
    publicAssets: []
  }
})
