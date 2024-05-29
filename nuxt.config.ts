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
  buildDir: "./dist",
  vite: {
    plugins: [
      wasmPack(['./wasm/flock'])
    ]
  }
})
