<?php

namespace YayMail\WP\Controllers;

use YayMail\YayMailEmails;
use YayMail\Utils\SingletonTrait;

defined( 'ABSPATH' ) || exit;

/**
 * AddonWpMailController Class
 *
 * @method static AddonWpMailController get_instance()
 */
class AddonWpMailController {

    use SingletonTrait;

    protected function __construct() {
        add_action( 'yaymail_register_emails', [ $this, 'register_emails' ] );

        add_action( 'yaymail_register_shortcodes', [ $this, 'yaymail_addon_shortcode_defined' ] );

        add_filter( 'woocommerce_mail_content', [ $this, 'woocommerce_mail_content' ], 10, 1 );

        add_filter( 'yaymail_addon_supported_plugins', [ $this, 'yaymail_addon_supported_plugins' ], 10, 1 );

        add_filter( 'yaymail_excluded_templates', [ $this, 'exclude_wp_global_header_footer' ] );

        // See fix_settings_page_assets() for why this is needed.
        add_action( 'admin_enqueue_scripts', [ $this, 'fix_settings_page_assets' ], PHP_INT_MAX );

        // See fix_ghf_enabled_status_write() / fix_settings_rest_response()
        // for why these are needed.
        add_filter( 'rest_pre_dispatch', [ $this, 'fix_ghf_enabled_status_write' ], 10, 3 );
        add_filter( 'rest_request_after_callbacks', [ $this, 'fix_settings_rest_response' ], 10, 3 );
    }

    /**
     * Short-circuits the "toggle global header/footer enabled" REST request
     * when it's for this addon's own platform, writing the correct DB option
     * instead of letting the outdated core's handler run at all.
     *
     * POST {namespace}/templates/global-header-footer/change-status is
     * registered by the shared YayMail\Controllers\TemplateController, which
     * -- like the other shared classes -- resolves to whichever yaymail-core
     * plugin is active (see the class-loading precedence in
     * email-builder.php). This addon's own copy of that method
     * reads the request's "platform" param and picks the right option key
     * via PlatformRegistry, but an outdated core's copy (<= 4.4.2) predates
     * that entirely: it unconditionally does
     * `SettingModel::update( [ 'global_header_footer_enabled' => $status ] )`,
     * ignoring "platform" completely. So toggling the switch on this addon's
     * own settings screen was silently flipping YayMail's WooCommerce global
     * header/footer instead of this addon's own -- exactly the report: "khi
     * click enable thì nó enable global header/footer của yaymail".
     *
     * rest_pre_dispatch fires before the route's callback runs; returning a
     * non-null value here skips that callback (and the wrong core class)
     * entirely for this one route+platform combination. Every other REST
     * route, and this same route for the "yaymail" platform (or no platform
     * param, i.e. requests from YayMail's own screen), passes through
     * untouched.
     *
     * @param mixed            $result  Untouched (null) unless short-circuiting.
     * @param \WP_REST_Server  $server  Unused.
     * @param \WP_REST_Request $request Current REST request.
     * @return mixed
     */
    public function fix_ghf_enabled_status_write( $result, $server, $request ) {
        if ( '/' . YAYMAIL_REST_NAMESPACE . '/templates/global-header-footer/change-status' !== $request->get_route() ) {
            return $result;
        }

        if ( 'email-builder' !== $request->get_param( 'platform' ) ) {
            return $result;
        }

        $status = sanitize_text_field( (string) $request->get_param( 'status' ) );
        $this->update_yaymail_setting( 'wp_global_header_footer_enabled', $status );

        return new \WP_REST_Response(
            [
                'global_header_footer_enabled'    => get_option( 'yaymail_settings' )['global_header_footer_enabled'] ?? false,
                'wp_global_header_footer_enabled' => $status,
            ]
        );
    }

    /**
     * Adds the "wp_global_header_footer_enabled" key into the response of
     * GET {namespace}/settings when it's missing.
     *
     * That response is YayMail\Models\SettingModel::find_all() -- the same
     * class-loading ambiguity as everywhere else in this file. An outdated
     * core's copy of SettingModel doesn't declare
     * "wp_global_header_footer_enabled" in its META_KEYS/DEFAULT at all
     * (this addon's own copy does), so the key is simply absent from the
     * response regardless of what's actually stored in the DB. The settings
     * screen reads this object by dynamic key (yaymail's own key on
     * YayMail's screen, this addon's own key on this addon's screen) to
     * decide whether to show the "Global header/footer is OFF, please
     * enable it globally" banner, so a missing key always reads as falsy --
     * the toggle would appear "off" here even right after
     * fix_ghf_enabled_status_write() above successfully turned it on.
     *
     * Only ever adds the key when absent; never overwrites an existing
     * value, so this has no effect once the active core is updated to
     * include it itself.
     *
     * @param \WP_REST_Response|\WP_Error $response Response from the matched callback.
     * @param array                       $handlers Unused.
     * @param \WP_REST_Request            $request  Current REST request.
     * @return \WP_REST_Response|\WP_Error
     */
    public function fix_settings_rest_response( $response, $handlers, $request ) {
        if ( '/' . YAYMAIL_REST_NAMESPACE . '/settings' !== $request->get_route() ) {
            return $response;
        }

        if ( ! ( $response instanceof \WP_REST_Response ) ) {
            return $response;
        }

        $data = $response->get_data();
        if ( ! is_array( $data ) || array_key_exists( 'wp_global_header_footer_enabled', $data ) ) {
            return $response;
        }

        $data['wp_global_header_footer_enabled'] = get_option( 'yaymail_settings' )['wp_global_header_footer_enabled'] ?? false;
        $response->set_data( $data );

        return $response;
    }

    /**
     * Merges one key into the consolidated "yaymail_settings" option, the
     * same storage YayMail\Models\SettingModel::update() writes to --
     * reimplemented directly to avoid relying on that (ambiguously
     * resolved) class for a single-key write.
     */
    private function update_yaymail_setting( $key, $value ) {
        $settings         = get_option( 'yaymail_settings' );
        $settings         = is_array( $settings ) ? $settings : [];
        $settings[ $key ] = $value;
        update_option( 'yaymail_settings', $settings );
    }

    /**
     * Swaps this addon's own settings screen (email-builder-settings)
     * back onto its own compiled JS/CSS build when an outdated yaymail-core
     * plugin (<= 4.4.2, free "yaymail" or paid "yaymail-pro" /
     * "email-customizer-for-woocommerce") is active alongside it.
     */
    public function fix_settings_page_assets() {
        if ( ! function_exists( 'get_current_screen' ) ) {
            return;
        }

        $screen = get_current_screen();
        if ( ! $screen || 'yaycommerce_page_email-builder-settings' !== $screen->id ) {
            return;
        }

        if ( ! defined( 'EMAIL_BUILDER_PLUGIN_URL' ) || ! defined( 'EMAIL_BUILDER_PLUGIN_PATH' ) ) {
            return;
        }

        $handle  = 'module/yaymail/yaymail-main.tsx';
        $scripts = wp_scripts();
        if ( empty( $scripts->registered[ $handle ] ) ) {
            return;
        }

        $current_src = (string) $scripts->registered[ $handle ]->src;
        if ( '' === $current_src || 0 === strpos( $current_src, EMAIL_BUILDER_PLUGIN_URL ) ) {
            return;
            // Nothing registered yet, or already correctly sourced.
        }

        $manifest_path = EMAIL_BUILDER_PLUGIN_PATH . 'assets/dist/yaymail/manifest.json';
        if ( ! file_exists( $manifest_path ) ) {
            return;
        }

        $manifest = json_decode( (string) file_get_contents( $manifest_path ), true );
        $entry    = $manifest['yaymail-main.tsx'] ?? null;
        if ( empty( $entry['file'] ) ) {
            return;
        }

        $base_url = EMAIL_BUILDER_PLUGIN_URL . 'assets/dist/yaymail/';
        $deps     = $scripts->registered[ $handle ]->deps;
        $version  = $scripts->registered[ $handle ]->ver;
        // wp_deregister_script() below drops the WP_Dependency object entirely,
        // including the ->extra['data'] SettingsPage already localized onto it
        // (window.yaymailData) -- capture it so it can be restored onto the
        // re-registered handle instead of silently disappearing from the page.
        $extra = $scripts->registered[ $handle ]->extra;
        if ( ! empty( $extra['data'] ) && is_string( $extra['data'] ) ) {
            $extra['data'] = $this->correct_localized_yaymail_data( $extra['data'] );
        }

        // Cancel the stale modulepreload <link> tags the wrongly-sourced
        // YayMailViteApp instance already queued for admin_head. get_instance()
        // returns the one live singleton regardless of which plugin's file it
        // was constructed from, so this reaches the exact callback that was
        // registered.
        if ( class_exists( 'YayMail\\Utils\\YayMailViteApp', false ) ) {
            $vite_app = \YayMail\Utils\YayMailViteApp::get_instance();
            remove_action( 'admin_head', [ $vite_app, 'register_preload_modules' ] );
        }

        // Re-registering an already-registered handle is a silent no-op in
        // WP_Dependencies, so the wrong registration must be torn down first.
        wp_deregister_script( $handle );
        wp_register_script( $handle, $base_url . $entry['file'], $deps, $version, true );
        if ( ! empty( $extra ) ) {
            $scripts->registered[ $handle ]->extra = $extra;
        }
        wp_enqueue_script( $handle );

        // Swap the stylesheet: drop whichever "yay/yaymail-main-*" handle the
        // wrong build registered (hash unknown up front, hence the prefix
        // scan) and register this addon's own.
        $styles = wp_styles();
        foreach ( array_keys( $styles->registered ) as $style_handle ) {
            if ( 0 === strpos( $style_handle, 'yay/yaymail-main-' ) ) {
                wp_dequeue_style( $style_handle );
                wp_deregister_style( $style_handle );
            }
        }
        foreach ( (array) ( $entry['css'] ?? [] ) as $css_file ) {
            $style_handle = 'yay/' . $css_file;
            if ( ! isset( $styles->registered[ $style_handle ] ) ) {
                wp_register_style( $style_handle, $base_url . $css_file, [], $version );
            }
            wp_enqueue_style( $style_handle );
        }

        // Re-add correct modulepreload links for this addon's own chunks.
        $preload_files = [];
        foreach ( (array) ( $entry['imports'] ?? [] ) as $import_key ) {
            if ( ! empty( $manifest[ $import_key ]['file'] ) ) {
                $preload_files[] = $manifest[ $import_key ]['file'];
            }
        }
        if ( $preload_files ) {
            add_action(
                'admin_head',
                function () use ( $preload_files, $base_url ) {
                    foreach ( $preload_files as $file ) {
                        echo '<link rel="modulepreload" href="' . esc_attr( $base_url . $file ) . '">';
                    }
                }
            );
        }
    }

    /**
     * Rewrites the "var yaymailData = {...};" JSON blob already localized
     * onto this addon's own settings screen script handle, in place.
     *
     * The shared YayMail\Engine\Backend\SettingsPage class that produced it
     * is loaded from whichever yaymail-core plugin is active (see the
     * class-loading precedence in email-builder.php); an outdated
     * core's copy (<= 4.4.2, free "yaymail" or paid "yaymail-pro" /
     * "email-customizer-for-woocommerce") predates the "email-builder"
     * platform entirely and unconditionally calls
     * YayMail\Utils\Localize::get_global_headers_footers() with no argument,
     * which always resolves to the WooCommerce "yaymail_global_header_footer"
     * data -- even on this addon's own settings screen, which should show
     * its own "wp_global_header_footer" data instead. It also localizes
     * urls.asset_url / urls.vite_dynamic_base as the *core* plugin's own
     * folder unconditionally, so any image that exists only in this addon's
     * own assets/images/ (e.g. the settings tour's "tour-mockup-wp.png"
     * step) 404s and renders as a broken image, even once
     * fix_settings_page_assets() has already fixed which JS bundle serves
     * the page.
     *
     * @param string $data_script The "var yaymailData = {...};" script body
     *                            captured from extra['data'] before this
     *                            handle is deregistered.
     * @return string The same shape, with the fields above corrected -- or
     *                 the input unchanged if it doesn't parse as expected.
     */
    private function correct_localized_yaymail_data( $data_script ) {
        if ( ! preg_match( '/^var\s+yaymailData\s*=\s*(.*);\s*$/s', $data_script, $matches ) ) {
            return $data_script;
        }

        $data = json_decode( $matches[1], true );
        if ( ! is_array( $data ) ) {
            return $data_script;
        }

        $data['platform'] = 'email-builder';

        if ( isset( $data['builder'] ) && is_array( $data['builder'] ) ) {
            $data['builder']['global_headers_footers'] = $this->get_wp_global_header_and_footer();
        }

        if ( isset( $data['urls'] ) && is_array( $data['urls'] ) ) {
            $data['urls']['asset_url']         = EMAIL_BUILDER_PLUGIN_URL . 'assets/images/';
            $data['urls']['vite_dynamic_base'] = EMAIL_BUILDER_PLUGIN_URL . 'assets/dist/yaymail/';
        }

        return 'var yaymailData = ' . wp_json_encode( $data ) . ';';
    }

    /**
     * Self-contained read of the "wp_global_header_footer" template's saved
     * elements, split into header/footer around the "skeleton_divider"
     * marker -- deliberately independent of the shared
     * YayMail\Models\TemplateModel / YayMail\Utils\Localize classes. Those
     * resolve to whichever yaymail-core plugin is active, and an outdated
     * core's copies don't accept a $template_name argument at all (see
     * correct_localized_yaymail_data() above), so calling them from here
     * would silently return the wrong data again.
     */
    private function get_wp_global_header_and_footer() {
        global $wpdb;

        $post_id = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT posts.ID FROM {$wpdb->posts} AS posts
                 JOIN {$wpdb->postmeta} AS postmeta ON posts.ID = postmeta.post_id
                 WHERE posts.post_type = %s
                   AND posts.post_status IN ('publish', 'pending', 'future')
                   AND postmeta.meta_key = %s
                   AND postmeta.meta_value = %s",
                'yaymail_template',
                '_yaymail_template',
                'wp_global_header_footer'
            )
        );

        $elements = $post_id ? get_post_meta( $post_id, '_yaymail_elements', true ) : [];
        $elements = is_array( $elements ) ? $elements : [];

        $divider_index = array_search( 'skeleton_divider', array_column( $elements, 'type' ), true );

        return [
            'language'               => 'en',
            'global_header_elements' => false !== $divider_index ? array_slice( $elements, 0, $divider_index ) : [],
            'global_footer_elements' => false !== $divider_index ? array_slice( $elements, $divider_index + 1 ) : [],
        ];
    }

    public function exclude_wp_global_header_footer( $excluded ) {
        $excluded[] = 'wp_global_header_footer';
        return $excluded;
    }

    public function yaymail_addon_shortcode_defined( $shortcode_service ) {
        \YayMail\WP\Shortcodes\WPShortcodes::get_instance();
    }

    public function register_emails( YayMailEmails $yaymail_emails ) {
        $yaymail_emails->register( \YayMail\WP\Emails\WpMail::get_instance() );
        $yaymail_emails->register( \YayMail\WP\Emails\GlobalHeaderFooter::get_instance() );
    }

    public function woocommerce_mail_content( $content ) {
        $wc_email_marker = '<!-- yaymail:wp-has-template-email-content -->';
        return $wc_email_marker . $content;
    }

    public function yaymail_addon_supported_plugins( $data ) {
        $data['YayMailWPAddonEDD'] = [
            'plugin_name'            => 'Easy Digital Downloads',
            'template_ids'           => [
                'wp-core-edd-purchase-receipt',
                'wp-core-edd-order_receipt',
                'wp-core-edd-admin_order_notice',
                'wp-core-edd-order_refund',
                'wp-core-edd-admin_order_refund',
                'wp-core-edd-new_user',
                'wp-core-edd-new_user_admin',
                'wp-core-edd-user_verification',
                'wp-core-edd-password_reset',
                'wp-core-edd-stripe_early_fraud_warning',
            ],
            'slug_name'              => 'yaymail-wp-addon-edd',
            'link_upgrade'           => 'https://yaycommerce.com/support/',
            'description'            => 'Use <strong>Email Builder</strong> to customize your <strong>Easy Digital Downloads</strong> email templates.',
            'plugin_slug'            => 'yaymail-wp-addon-for-edd',
            'is_3rd_party_installed' => function_exists( 'EDD' ),
            'categories'             => [ 'wordpress', 'others' ],
        ];
        return $data;
    }
}
