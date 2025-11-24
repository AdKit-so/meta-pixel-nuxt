import META from '@adkit.so/meta-pixel'
import type { StandardEvent, EventData, EventMetaData } from '@adkit.so/meta-pixel'

// Re-export types for easy importing
export type { StandardEvent, EventData, EventMetaData }

/**
 * Access the Meta Pixel instance
 * Provides direct access to all methods from @adkit.so/meta-pixel
 *
 * @returns The Meta Pixel instance
 *
 * @example
 * const meta = useMetaPixel();
 * meta.track('Purchase', { value: 99.99, currency: 'USD' });
 * meta.trackCustom('MyEvent', { data: 'value' });
 * const loaded = meta.isLoaded();
 */
export const useMetaPixel = () => {
  return META
}
