# Tests

This directory contains all test-related files for the Meta Pixel Nuxt module.

## 🚀 Quick Start

**Run tests (before committing):**
```bash
npm test
```

This tests:
- ✅ Does it load properly in general
- ✅ Does event tracking work
- ✅ Does page blacklist work (script doesn't load)
- ✅ Does page whitelist work (script only loads on whitelisted pages)

**Debug tests with visual UI:**
```bash
npm run test:ui
```

Opens an interactive UI where you can see the browser and what's happening.

**Yes, it uses your playground app!** The tests automatically start the dev server and test against the actual pages you created in `playground/`.

## 📁 Files in This Directory

```
test/
├── README.md                     # This file
├── vitest.config.ts              # Config for unit tests
├── playwright.config.ts          # Config for E2E tests
├── config.test.ts                # Unit tests (logic only)
├── module.test.ts                # Unit tests (logic only)
└── e2e/
    └── pixel-loading.spec.ts     # E2E tests (actual browser tests)
```

## 🎯 Test Commands

### Main Commands

```bash
# Run tests (actual browser behavior)
npm test

# Run tests with interactive UI (for debugging)
npm run test:ui

# Run unit tests only (just logic checks, very fast)
npm run test:unit
```

### What Each Command Tests

#### `npm test` - Main Test Command ⭐

Tests **actual browser behavior** using the playground app:
- ✅ Meta Pixel script loads on allowed pages
- ✅ Meta Pixel script **does NOT load** on excluded pages
- ✅ PageView events are tracked correctly
- ✅ Route exclusion via `excludedRoutes` config works
- ✅ Route exclusion via `metaPixel: false` page meta works
- ✅ SPA navigation works correctly
- ✅ **Nothing loads at all** when disabled

**Output:** Pass/fail results in terminal

#### `npm run test:ui` - For Debugging 🔍

Same as above, but with an **interactive UI** where you can:
- See the browser window
- Step through tests
- Inspect the DOM
- View console logs
- See network requests

**Output:** Opens a UI in your browser

#### `npm run test:unit` - Fast Logic Checks ⚡

Tests **only the logic** (no browser):
- Regex pattern matching
- Route matching rules

**Output:** Quick pass/fail in terminal (~200ms)

## 🎬 What Gets Tested (E2E)

### ✅ Script Loading on Allowed Pages
- Meta Pixel script loads
- `fbq` function exists
- Facebook script tag is in DOM
- PageView events are tracked

### ❌ Script Does NOT Load on Excluded Pages
- Meta Pixel script does NOT load
- `fbq` function does NOT exist
- No Facebook script tags in DOM
- No PageView events tracked

### 🔄 SPA Navigation
- Script initializes when navigating from excluded → allowed
- No tracking when navigating to excluded routes

## 📝 Important Notes

- E2E tests automatically start/stop the dev server
- Tests run in Chromium by default
- All test configs are in this `test/` directory (no clutter in root)
- E2E tests verify that **nothing loads** when the module is disabled

