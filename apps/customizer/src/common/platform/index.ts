/**
 * Platform module — single source of truth for "which product is this" on the
 * frontend (YayMail for WooCommerce vs Email Builder).
 *
 * Mirrors the backend `YayMail\Platform` provider. The value comes from the
 * localized `window.yaymailData.platform` and never changes at runtime, so this
 * is a plain module (usable in components, API helpers, utils, and module-level
 * code alike) rather than a React hook/context.
 */

export type Platform = 'yaymail' | 'email-builder';

const currentPlatform: Platform = (window.yaymailData?.platform as Platform) ?? 'yaymail';

/** Raw platform key — pass to REST endpoints (`platform` / `plugin_source`). */
export function getPlatform(): Platform {
  return currentPlatform;
}

/** True on the WordPress email-builder product. */
export function isWpPlatform(): boolean {
  return currentPlatform === 'email-builder';
}

/** True on the WooCommerce (YayMail) product. */
export function isWooPlatform(): boolean {
  return currentPlatform === 'yaymail';
}

/**
 * Product brand name for the current platform — the single place to change
 * it if the WP product is ever renamed again.
 */
export function getBrandName(): 'YayMail' | 'Email Builder' {
  return isWpPlatform() ? 'Email Builder' : 'YayMail';
}

/**
 * Name of the underlying email system this platform customizes -- distinct from
 * getBrandName(): e.g. "Add custom attachments to your WordPress/WooCommerce
 * emails" describes what's being emailed, not the product doing the emailing.
 */
export function getEmailSystemName(): 'WordPress' | 'WooCommerce' {
  return isWpPlatform() ? 'WordPress' : 'WooCommerce';
}

/**
 * Global header/footer "enabled" setting key for the current platform.
 * Literals are not a common suffix rule, so each platform has its exact key.
 */
export function getGlobalHeaderFooterEnabledKey():
  | 'wp_global_header_footer_enabled'
  | 'global_header_footer_enabled' {
  return isWpPlatform() ? 'wp_global_header_footer_enabled' : 'global_header_footer_enabled';
}

/** Global header/footer base key for the current platform. */
export function getGlobalHeaderFooterKey():
  | 'wp_global_header_footer'
  | 'yaymail_global_header_footer' {
  return isWpPlatform() ? 'wp_global_header_footer' : 'yaymail_global_header_footer';
}
