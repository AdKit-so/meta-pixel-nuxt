import { describe, it, expect } from 'vitest'

describe('Route Matching Logic', () => {
  // Simulate the isAllowed function from the plugin
  const isAllowed = (path: string, meta: any, config: { excludedRoutes?: string[], includedRoutes?: string[] }) => {
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

  describe('Page Meta Override', () => {
    it('blocks tracking when metaPixel: false in page meta', () => {
      const result = isAllowed('/any-page', { metaPixel: false }, {})
      expect(result).toBe(false)
    })

    it('allows tracking when metaPixel: true in page meta', () => {
      const result = isAllowed('/excluded', { metaPixel: true }, { excludedRoutes: ['^/excluded'] })
      expect(result).toBe(true)
    })
  })

  describe('Excluded Routes', () => {
    it('blocks routes matching excludedRoutes pattern', () => {
      const config = { excludedRoutes: ['^/excluded'] }
      
      expect(isAllowed('/excluded', {}, config)).toBe(false)
      expect(isAllowed('/excluded/page', {}, config)).toBe(false)
      expect(isAllowed('/other', {}, config)).toBe(true)
    })

    it('allows routes not matching excludedRoutes pattern', () => {
      const config = { excludedRoutes: ['^/admin', '^/api'] }
      
      expect(isAllowed('/', {}, config)).toBe(true)
      expect(isAllowed('/about', {}, config)).toBe(true)
      expect(isAllowed('/admin', {}, config)).toBe(false)
      expect(isAllowed('/api/users', {}, config)).toBe(false)
    })
  })

  describe('Included Routes', () => {
    it('only allows routes matching includedRoutes pattern', () => {
      const config = { includedRoutes: ['^/manual'] }
      
      expect(isAllowed('/manual', {}, config)).toBe(true)
      expect(isAllowed('/manual/page', {}, config)).toBe(true)
      expect(isAllowed('/', {}, config)).toBe(false)
      expect(isAllowed('/other', {}, config)).toBe(false)
    })

    it('includedRoutes takes precedence over excludedRoutes', () => {
      const config = { 
        includedRoutes: ['^/manual'],
        excludedRoutes: ['^/excluded']
      }
      
      // Only includedRoutes matters when both are set
      expect(isAllowed('/manual', {}, config)).toBe(true)
      expect(isAllowed('/excluded', {}, config)).toBe(false)
      expect(isAllowed('/', {}, config)).toBe(false)
    })
  })

  describe('Default Behavior', () => {
    it('allows all routes when no config is set', () => {
      expect(isAllowed('/', {}, {})).toBe(true)
      expect(isAllowed('/any-page', {}, {})).toBe(true)
      expect(isAllowed('/admin', {}, {})).toBe(true)
    })
  })
})

