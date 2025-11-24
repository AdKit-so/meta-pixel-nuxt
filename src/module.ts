import { defineNuxtModule, addPlugin, createResolver, addImports } from '@nuxt/kit'

export interface ModuleOptions {
  /** Single pixel ID or array of pixel IDs */
  pixelIds: string | string[]
  /** Whether to track PageView on initialization (default: true) */
  autoTrackPageView?: boolean
  /** Enable styled debug logging in console (default: false) */
  debug?: boolean
  /** Enable tracking on localhost (default: false) */
  enableLocalhost?: boolean
  /** Routes to ignore (regex strings). If set, these routes will NOT be tracked. */
  excludedRoutes?: string[]
  /** Routes to track (regex strings). If set, ONLY these routes will be tracked. */
  includedRoutes?: string[]
}

export interface MetaPixelPublicRuntimeConfig {
  pixelIds: string | string[]
  autoTrackPageView: boolean
  debug: boolean
  enableLocalhost: boolean
  excludedRoutes: string[]
  includedRoutes: string[]
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    metaPixel: MetaPixelPublicRuntimeConfig
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@adkit.so/meta-pixel-nuxt',
    version: '1.0.0',
    configKey: 'metaPixel',
    compatibility: {
      nuxt: '>=3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    pixelIds: '',
    autoTrackPageView: true,
    debug: false,
    enableLocalhost: false,
    excludedRoutes: [],
    includedRoutes: [],
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Set up public runtime config
    const publicConfig: MetaPixelPublicRuntimeConfig = {
      pixelIds: options.pixelIds,
      autoTrackPageView: options.autoTrackPageView ?? true,
      debug: options.debug ?? false,
      enableLocalhost: options.enableLocalhost ?? false,
      excludedRoutes: options.excludedRoutes ?? [],
      includedRoutes: options.includedRoutes ?? [],
    }

    nuxt.options.runtimeConfig.public.metaPixel = publicConfig

    // Add plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Auto-import composable (only useMetaPixel)
    addImports([
      {
        from: resolver.resolve('./runtime/composable'),
        name: 'useMetaPixel',
      },
    ])
  },
})
