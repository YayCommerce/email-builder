<?php
/**
 * WordPress email-builder platform implementation (the "email-builder" product,
 * Email Builder).
 *
 * Lives under core/ (the YayMail\WP\ PSR-4 root), which is outside the shared
 * sync set, so it is never overwritten when the shared src/ is synced from the
 * YayMail core plugin.
 *
 * @package YayMail\WP\Platform
 */

namespace YayMail\WP\Platform;

use YayMail\Platform\PlatformInterface;

defined( 'ABSPATH' ) || exit;

class EmailBuilderPlatform implements PlatformInterface {

    public function key(): string {
        return 'email-builder';
    }

    public function plugin_path(): string {
        return EMAIL_BUILDER_PLUGIN_PATH;
    }

    public function plugin_url(): string {
        return EMAIL_BUILDER_PLUGIN_URL;
    }

    public function hook_suffix(): string {
        return 'yaycommerce_page_email-builder-settings';
    }

    public function attachment_option_name(): string {
        return defined( 'EMAIL_BUILDER_ATTACHMENT_OPTION_NAME' )
            ? EMAIL_BUILDER_ATTACHMENT_OPTION_NAME
            : YAYMAIL_ATTACHMENT_OPTION_NAME;
    }

    public function ghf_option_key( string $variant = 'base' ): string {
        return 'enabled' === $variant ? 'wp_global_header_footer_enabled' : 'wp_global_header_footer';
    }

    public function adapter() {
        return class_exists( 'YaymailWpPluginAdapter', false ) ? new \YaymailWpPluginAdapter() : null;
    }

    public function is_woo_product(): bool {
        return false;
    }

    public function woo_available(): bool {
        return class_exists( 'WooCommerce' );
    }
}
