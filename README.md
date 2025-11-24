# meta-pixel-nuxt

Nuxt 3 & 4 module for Meta Pixel tracking, built on top of [@adkit.so/meta-pixel](https://www.npmjs.com/package/@adkit.so/meta-pixel).

## Features

-   ✅ Auto-initialized via Nuxt config
-   ✅ Auto-imported composable: `useMetaPixel()`
-   ✅ Full TypeScript support with type inference
-   ✅ Styled debug logging
-   ✅ Multiple pixel IDs support
-   ✅ Localhost control
-   ✅ Compatible with Nuxt 3 & 4

## Installation

Install and add directly to your project:

```bash
npx nuxi@latest module add @adkit.so/meta-pixel-nuxt
```

Or via NPM:

```bash
npm install @adkit.so/meta-pixel-nuxt
```

## Setup

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
    modules: ['@adkit.so/meta-pixel-nuxt'],

    metaPixel: {
        pixelIds: 'YOUR_PIXEL_ID', // or array ['PIXEL_1', 'PIXEL_2']
        autoTrackPageView: true, // default: true
        debug: true, // Enable debug logs (default: false)
        enableLocalhost: true, // Enable on localhost (default: false)
    },
});
```

## Usage

The `useMetaPixel()` composable is auto-imported and ready to use anywhere in your Nuxt app. It provides direct access to the Meta Pixel instance with all methods from `@adkit.so/meta-pixel`.

### Basic Usage

```vue
<script setup>
    const meta = useMetaPixel();

    // Track standard events
    meta.track('Purchase', {
        value: 99.99,
        currency: 'USD',
        content_ids: ['SKU_123'],
    });

    // Track custom events
    meta.trackCustom('MyCustomEvent', {
        custom_param: 'value',
    });
</script>

<template>
    <button @click="meta.track('AddToCart', { value: 29.99, currency: 'USD' })">Add to Cart</button>
</template>
```

### With Event Deduplication

```vue
<script setup>
    const meta = useMetaPixel();

    const handleCheckout = () => {
        meta.track(
            'InitiateCheckout',
            {
                value: 149.99,
                currency: 'USD',
                num_items: 3,
            },
            {
                eventID: `checkout-${Date.now()}`, // Unique ID for deduplication
            },
        );
    };
</script>
```

### Check if Pixel is Loaded

```vue
<script setup>
    const meta = useMetaPixel();

    const trackIfReady = () => {
        if (meta.isLoaded()) {
            meta.track('Purchase', { value: 99.99, currency: 'USD' });
        }
    };
</script>
```

## Configuration Options

| Option              | Type                 | Default | Description                                                      |
| ------------------- | -------------------- | ------- | ---------------------------------------------------------------- |
| `pixelIds`          | `string \| string[]` | `''`    | **Required.** Single pixel ID or array of pixel IDs              |
| `autoTrackPageView` | `boolean`            | `true`  | Automatically track PageView on initialization                   |
| `debug`             | `boolean`            | `false` | Enable styled console logs with background colors                |
| `enableLocalhost`   | `boolean`            | `false` | Enable tracking on localhost (useful for testing)                |
| `excludedRoutes`    | `string[]`           | `[]`    | Array of regex strings to exclude from tracking                  |
| `includedRoutes`    | `string[]`           | `[]`    | Array of regex strings to whitelist (only these will be tracked) |

## Route Control

You can control where the pixel is loaded using three methods:

### 1. Exclude Routes (Global)

In `nuxt.config.ts`, provide an array of regex strings to exclude specific routes:

```typescript
export default defineNuxtConfig({
    metaPixel: {
        pixelIds: '...',
        // Disable on all routes starting with /embed/
        excludedRoutes: ['^/embed/.*'],
    },
});
```

### 2. Include Routes (Global)

If you only want to track specific sections, use `includedRoutes`. This takes precedence over excluded routes (except for page-level overrides).

```typescript
export default defineNuxtConfig({
    metaPixel: {
        pixelIds: '...',
        // Only track routes starting with /shop/ or /checkout/
        includedRoutes: ['^/shop/.*', '^/checkout/.*'],
    },
});
```

### 3. Page-Level Control

You can enable or disable the pixel on a per-page basis using `definePageMeta`:

```typescript
// pages/secret.vue
<script setup>
definePageMeta({
  metaPixel: false, // Disable tracking on this page
});
</script>
```

**Priority Order:**

1. Page-level `definePageMeta` (highest priority)
2. `includedRoutes` (if set, only these are tracked)
3. `excludedRoutes` (if set, these are ignored)
4. Default: Track everything

## Debug Mode

When `debug: true`, you'll see beautiful styled console logs:

-   🔵 **[Meta Pixel]** Info messages (blue background)
-   ✅ **[Meta Pixel]** Success messages (green background)
-   ⚠️ **[Meta Pixel]** Warning messages (orange background)

Example output:

```
[Meta Pixel] Initializing Meta Pixel... { pixelIds: [...], autoTrackPageView: true }
[Meta Pixel] ✓ Meta Pixel initialized successfully
[Meta Pixel] Tracking standard event: "Purchase" { data: {...}, eventData: {...} }
```

## Standard Events

All Facebook Pixel standard events are supported with full TypeScript autocomplete:

-   `AddPaymentInfo`
-   `AddToCart`
-   `AddToWishlist`
-   `CompleteRegistration`
-   `Contact`
-   `CustomizeProduct`
-   `Donate`
-   `FindLocation`
-   `InitiateCheckout`
-   `Lead`
-   `Purchase`
-   `Schedule`
-   `Search`
-   `StartTrial`
-   `SubmitApplication`
-   `Subscribe`
-   `ViewContent`

## Event Data Parameters

Common event data parameters (all optional):

-   `value` - The value of the event
-   `currency` - Currency code (e.g., 'USD')
-   `content_ids` - Array of product IDs/SKUs
-   `content_type` - 'product' or 'product_group'
-   `content_name` - Name of the page/product
-   `content_category` - Category of the page/product
-   `contents` - Array of `{ id, quantity }` objects
-   `num_items` - Number of items
-   `search_string` - Search query string
-   `status` - Registration status
-   `predicted_ltv` - Predicted lifetime value

## TypeScript Support

Full type safety with exported types:

```typescript
import type { StandardEvent, EventData, EventMetaData } from '@adkit.so/meta-pixel';

const meta = useMetaPixel();

const trackEvent = (event: StandardEvent, data: EventData) => {
    meta.track(event, data);
};
```

## License

MIT
