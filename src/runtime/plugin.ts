import { defineNuxtPlugin, useRuntimeConfig, useRoute, useRouter } from '#app'
import META from '@adkit.so/meta-pixel'
import type { MetaPixelPublicRuntimeConfig } from '../module'

export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  const config = useRuntimeConfig().public.metaPixel as MetaPixelPublicRuntimeConfig
  const router = useRouter()
  const route = useRoute()

  if (!config?.pixelIds || config.pixelIds === '') {
    console.warn('[Meta Pixel] No pixel IDs provided in nuxt.config.ts')
    return
  }

  /**
   * Check if the current route should be tracked
   */
  const isAllowed = (path: string, meta: any) => {
    // 1. Check page-level meta override
    if (meta.metaPixel === false) return false
    if (meta.metaPixel === true) return true

    // 2. Check included routes (whitelist)
    if (config.includedRoutes?.length) {
      return config.includedRoutes.some((r: string) => new RegExp(r).test(path))
    }

    // 3. Check excluded routes (blacklist)
    if (config.excludedRoutes?.length) {
      return !config.excludedRoutes.some((r: string) => new RegExp(r).test(path))
    }

    return true
  }

  /**
   * Initialize Meta Pixel
   */
  const init = () => {
    if (META.isLoaded()) return

    META.init({
      pixelIds: config.pixelIds,
      autoTrackPageView: config.autoTrackPageView,
      debug: config.debug,
      enableLocalhost: config.enableLocalhost,
    })
  }

  // Handle initial load
  if (isAllowed(route.path, route.meta)) {
    init()
  }

  // Handle route changes (SPA navigation)
  router.afterEach((to: any) => {
    if (isAllowed(to.path, to.meta)) {
      if (!META.isLoaded()) {
        // Initialize if not already loaded (this will trigger the initial PageView via the snippet)
        init()
      } else if (config.autoTrackPageView) {
        // Manually track PageView for subsequent navigations
        META.track('PageView')
      }
    }
  })
})
