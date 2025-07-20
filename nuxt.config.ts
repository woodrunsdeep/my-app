import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/modules
  modules: ['@nuxthub/core', '@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/scripts', 'shadcn-nuxt'],

  // https://devtools.nuxt.com
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  // Env variables - https://nuxt.com/docs/getting-started/configuration#environment-variables-and-private-tokens
  runtimeConfig: {
    public: {
      // Can be overridden by NUXT_PUBLIC_HELLO_TEXT environment variable
      helloText: 'Hello from the Edge 👋'
    }
  },
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-03-01',
  nitro: {
    experimental: {
      tasks: true
    }
  },

  // https://hub.nuxt.com/docs/getting-started/installation#options
  hub: {
    database: true
  },
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  // Development config
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
        commaDangle: 'never'
      }
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})
