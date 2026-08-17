<?php
/**
 * Plugin Name: Email Builder
 * Plugin URI: https://yaycommerce.com/email-builder/
 * Description: Customize WordPress core emails with the Email Builder drag-and-drop email builder.
 * Version: 1.0
 * Author: YayCommerce
 * Author URI: https://yaycommerce.com
 * Text Domain: email-builder
 * Domain Path: /i18n/languages/
 *
 * @package YayMail
 */

namespace YayMail;

defined( 'ABSPATH' ) || exit;

$yaymail_core_plugin_files = [
    'yaymail-pro/yaymail.php',
    'email-customizer-for-woocommerce/yaymail.php',
    'yaymail/yaymail.php',
];
$yaymail_active_plugins    = (array) get_option( 'active_plugins', [] );
$yaymail_network_plugins   = (array) get_site_option( 'active_sitewide_plugins', [] );
$yaymail_core_active       = false;
$yaymail_core_src_dirs     = [];

foreach ( $yaymail_core_plugin_files as $yaymail_core_plugin_file ) {
    if ( in_array( $yaymail_core_plugin_file, $yaymail_active_plugins, true ) || isset( $yaymail_network_plugins[ $yaymail_core_plugin_file ] ) ) {
        $yaymail_core_active = true;
        $yaymail_core_dir    = dirname( $yaymail_core_plugin_file );
        if ( ! in_array( $yaymail_core_dir, $yaymail_core_src_dirs, true ) ) {
            $yaymail_core_src_dirs[] = $yaymail_core_dir;
        }
    }
}

if ( ! $yaymail_core_active ) {
    if ( ! defined( 'YAYMAIL_PREFIX' ) ) {
        define( 'YAYMAIL_PREFIX', 'yaymail' );
    }
    if ( ! defined( 'YAYMAIL_DEBUG' ) ) {
        define( 'YAYMAIL_DEBUG', false );
    }

    if ( ! defined( 'YAYMAIL_PLUGIN_URL' ) ) {
        define( 'YAYMAIL_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
    }

    if ( ! defined( 'YAYMAIL_PLUGIN_PATH' ) ) {
        define( 'YAYMAIL_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
    }

    if ( ! defined( 'YAYMAIL_PLUGIN_BASENAME' ) ) {
        define( 'YAYMAIL_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
    }

    if ( ! defined( 'YAYMAIL_IS_DEVELOPMENT' ) ) {
        define( 'YAYMAIL_IS_DEVELOPMENT', false );
    }

    if ( ! defined( 'YAYMAIL_REST_NAMESPACE' ) ) {
        define( 'YAYMAIL_REST_NAMESPACE', 'yaymail/v1' );
    }

    if ( ! defined( 'YAYMAIL_ATTACHMENT_OPTION_NAME' ) ) {
        define( 'YAYMAIL_ATTACHMENT_OPTION_NAME', 'yaymail_general_attachment_' );
    }
}//end if

if ( ! defined( 'EMAIL_BUILDER_PLUGIN_URL' ) ) {
    define( 'EMAIL_BUILDER_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'EMAIL_BUILDER_PLUGIN_BASENAME' ) ) {
    define( 'EMAIL_BUILDER_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}

if ( ! defined( 'EMAIL_BUILDER_PLUGIN_PATH' ) ) {
    define( 'EMAIL_BUILDER_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );
}

if ( ! defined( 'EMAIL_BUILDER_ATTACHMENT_OPTION_NAME' ) ) {
    define( 'EMAIL_BUILDER_ATTACHMENT_OPTION_NAME', 'yaymail_wp_general_attachment_' );
}

$yaymail_has_required_deps = true;

if ( defined( 'EMAIL_BUILDER_VERSION' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'templates/fallbacks/fallback-exists.php';
    $yaymail_has_required_deps = false;
} else {
    define( 'EMAIL_BUILDER_VERSION', '1.0' );
}


if ( version_compare( PHP_VERSION, '7.2', '<' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'templates/fallbacks/fallback-minimum-php.php';
    $yaymail_has_required_deps = false;
}

if ( version_compare( $GLOBALS['wp_version'], '5.2', '<' ) ) {
    require_once plugin_dir_path( __FILE__ ) . 'templates/fallbacks/fallback-minimum-wp.php';
    $yaymail_has_required_deps = false;
}

if ( ! $yaymail_has_required_deps ) {
    add_action(
        'admin_init',
        function() {
            deactivate_plugins( plugin_basename( __FILE__ ) );
        }
    );

    // Return early to prevent loading the plugin.
    return;
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/EmailBuilderPluginAdapter.php';

/**
 * Builds the "always prefer this addon's own src/ for overlapping YayMail\ classes"
 * autoloader. Returns a fresh Closure instance each call -- spl_autoload_register()
 * treats re-registering the *same* Closure object as a no-op even with $prepend,
 * so re-establishing the front-of-queue position (see below) requires a genuinely
 * new instance each time, not the same variable reused.
 *
 * @return callable
 */
function email_builder_build_autoloader( $yaymail_core_active, $yaymail_core_src_dirs ) {
    return function ( $class ) use ( $yaymail_core_active, $yaymail_core_src_dirs ) {
        $prefix = 'YayMail\\';

        if ( strpos( $class, $prefix ) !== 0 ) {
            return;
        }

        $relative      = substr( $class, strlen( $prefix ) );
        $relative_path = str_replace( '\\', '/', $relative ) . '.php';

        // Never use class_exists() here: it can trigger autoload and produce false "active" results.
        $core_plugin_active = $yaymail_core_active || defined( 'YAYMAIL_VERSION' );
        if ( ! $core_plugin_active ) {
            // Best-effort detection for load order edge cases.
            if ( ! function_exists( 'is_plugin_active' ) ) {
                require_once ABSPATH . 'wp-admin/includes/plugin.php';
            }
            if ( function_exists( 'is_plugin_active' ) ) {
                $yaymail_versions = [
                    'yaymail-pro/yaymail.php',
                    'email-customizer-for-woocommerce/yaymail.php',
                    'yaymail/yaymail.php',
                ];
                foreach ( $yaymail_versions as $plugin_file ) {
                    if ( is_plugin_active( $plugin_file ) || is_plugin_active_for_network( $plugin_file ) ) {
                        $core_plugin_active = true;
                        break;
                    }
                }
            }
        }

        // 1) Always prefer this addon's src first for overlapping classes.
        $addon_src_file = EMAIL_BUILDER_PLUGIN_PATH . 'src/' . $relative_path;
        if ( file_exists( $addon_src_file ) ) {
            require $addon_src_file;
            return;
        }

        // 2) If YayMail core is active, use active core plugin class files as fallback.
        if ( $core_plugin_active && defined( 'WP_PLUGIN_DIR' ) ) {
            $core_dirs = $yaymail_core_src_dirs;
            if ( empty( $core_dirs ) ) {
                // Fallback for edge cases when active-plugin options are not ready yet.
                $core_dirs = [ 'yaymail-pro', 'email-customizer-for-woocommerce', 'yaymail' ];
            }

            foreach ( $core_dirs as $core_dir ) {
                $core_src_file = WP_PLUGIN_DIR . '/' . $core_dir . '/src/' . $relative_path;
                if ( file_exists( $core_src_file ) ) {
                    require $core_src_file;
                    return;
                }
            }
        }

        // 3) Only fall back to this addon's core/ when the main plugin isn't active.
        if ( ! $core_plugin_active ) {
            $core_file = EMAIL_BUILDER_PLUGIN_PATH . 'core/' . $relative_path;
            if ( file_exists( $core_file ) ) {
                require $core_file;
            }
        }
    };
}

spl_autoload_register( email_builder_build_autoloader( $yaymail_core_active, $yaymail_core_src_dirs ), true, true );

// $prepend = true above only puts that closure ahead of whatever is *already
// registered* at this point in *this* plugin's own bootstrap. A yaymail-core
// variant that loads after this addon (per its position in the "active_plugins"
// option -- loads plugin main files in that exact order) runs its own
// Composer-generated loader's register( true ) afterwards, which prepends *again*
// and lands back in front of this one -- that core's classmap is authoritative
// (composer.json "classmap-authoritative": true) and does contain e.g.
// YayMail\Elements\Heading, so it resolves the class itself and this addon's
// "always prefer this addon's src first" rule (step 1 above) never runs.
// Re-registering a *fresh* instance once every plugin's top-level file has
// finished running -- "plugins_loaded" fires only after that whole loop completes
// -- makes this addon's rule the *last* prepend no matter which yaymail-core
// variant is active or what order plugins were activated in.
add_action(
    'plugins_loaded',
    function () use ( $yaymail_core_active, $yaymail_core_src_dirs ) {
        spl_autoload_register( email_builder_build_autoloader( $yaymail_core_active, $yaymail_core_src_dirs ), true, true );
    },
    -9999
);

// Declare this platform so shared core reads platform-specific values from the
// registry instead of detecting the platform inline. Registered after the core
// autoloader above so PlatformRegistry/PlatformInterface resolve, and before
// Initialize runs on plugins_loaded.
\YayMail\Platform\PlatformRegistry::register( new \YayMail\WP\Platform\EmailBuilderPlatform() );

// Also register the "yaymail" (WooCommerce) platform so shared core classes
// (e.g. SettingsPage, YayMailViteApp) resolve the free/lite yaymail-settings
// screen correctly when this addon's autoloader wins the class-loading race
// (its src/ is always preferred for overlapping YayMail\ classes). Without
// this, PlatformRegistry::get('yaymail') returns null and the yaymail-settings
// page never enqueues its script, leaving the admin screen stuck on the
// loading spinner.
//
// Only needed for yaymail core <= 4.4.2, which never registers itself with
// PlatformRegistry. Read the version straight from the plugin file header
// (not the YAYMAIL_VERSION constant) since this addon can load before the
// core plugin file runs, depending on active-plugin order.
$yaymail_needs_platform_registration_fix = false;
if ( $yaymail_core_active && ! empty( $yaymail_core_src_dirs ) ) {
    $yaymail_core_plugin_file = WP_PLUGIN_DIR . '/' . $yaymail_core_src_dirs[0] . '/yaymail.php';
    if ( file_exists( $yaymail_core_plugin_file ) ) {
        $yaymail_core_plugin_data = get_file_data( $yaymail_core_plugin_file, [ 'Version' => 'Version' ] );
        if ( ! empty( $yaymail_core_plugin_data['Version'] ) ) {
            $yaymail_needs_platform_registration_fix = version_compare( $yaymail_core_plugin_data['Version'], '4.4.2', '<=' );
        }
    }
}

if ( $yaymail_needs_platform_registration_fix ) {
    \YayMail\Platform\PlatformRegistry::register( new \YayMail\Platform\YaymailPlatform() );
}

// Any active yaymail-core variant (free "yaymail", or paid "yaymail-pro" /
// "email-customizer-for-woocommerce") <= 4.4.2 ships its own outdated shared
// src/ (e.g. its Functions.php is missing helpers this addon's SettingsPage
// depends on, such as yaymail_get_ghf_disallowed_element_types()). Since this
// addon's SettingsPage/Initialize/etc. always win the class-loading race
// regardless of which core is active, PlatformRegistry::host_platform() must
// also point at this addon (not the outdated core) whenever that's the case,
// so Helpers::get_plugin_path()/get_plugin_url() (and the required
// src/Functions.php) resolve to this addon's own, up-to-date files.
if ( ! defined( 'EMAIL_BUILDER_HOSTS_CORE' ) ) {
    define( 'EMAIL_BUILDER_HOSTS_CORE', $yaymail_needs_platform_registration_fix );
}

// Only the free "yaymail" lite plugin's compiled JS bundle predates the
// per-language global-header-footer array format -- true of every released
// version, not just <= 4.4.2 (confirmed: yaymail 4.4.3's bundle is still the
// legacy build, byte-identical to this addon's own). The paid "yaymail-pro" /
// "email-customizer-for-woocommerce" variants already ship a bundle built
// against the newer shape (their own Localize::get_global_headers_footers()
// already calls the multi-language method), matching this addon's own.
// SettingsPage's legacy-shape workaround for the 'yaymail' platform must
// therefore be scoped to just the lite plugin being the active core -- NOT
// tied to $yaymail_needs_platform_registration_fix's version gate, or it
// wrongly breaks the lite plugin (>= 4.4.3) with "Cannot read properties of
// undefined (reading 'find')".
if ( ! defined( 'YAYMAIL_LITE_LEGACY_GHF_SHAPE' ) ) {
    define(
        'YAYMAIL_LITE_LEGACY_GHF_SHAPE',
        $yaymail_core_active && ! empty( $yaymail_core_src_dirs ) && 'yaymail' === $yaymail_core_src_dirs[0]
    );
}

/**
 * Initialize constants
 */

if ( defined( 'EMAIL_BUILDER_VERSION' ) ) {
    Constants\ConstantsHandler::get_instance();
}

add_action(
    'plugins_loaded',
    function () {
        \EmailBuilderScoped\YayCommerce\AdminShell\AdminShell::boot();
        \EmailBuilderScoped\YayCommerce\AdminShell\AdminShell::register_plugin(
            new \EmailBuilderPluginAdapter()
        );
        if ( ! function_exists( 'YayMail\\init' ) && function_exists( 'WC' ) ) {
            \YayMail\WP\Notices\SuggestYayMailNotice::get_instance();
        }
        if ( function_exists( 'EDD' ) ) {
            add_filter( 'yaymail_temp_init_hook_name', '__return_false' );
            add_action( 'init', [ \YayMail\Initialize::get_instance(), 'init_core' ], 9 );
        }
    }
);

if ( ! function_exists( 'update_yaymail_admin_notice' ) ) {
    function update_yaymail_admin_notice() {
        ?>
<div class="error">
    <p>
        <?php
                // translators: %s: search WooCommerce plugin link
                printf( 'YayMail – WordPress Email Customizer ' . esc_html__( 'is enabled but not effective. It requires %1$sYayMail%2$s version 4.4 or later in order to work.', 'yaymail' ), '<a href="' . esc_url( admin_url( 'plugin-install.php?s=yaymail&tab=search&type=term' ) ) . '">', '</a>' );
        ?>
    </p>
</div>
        <?php
    }
}

if ( ! function_exists( 'YayMail\\wp_mail_init' ) ) {
    function wp_mail_init() {
        if ( defined( 'EMAIL_BUILDER_VERSION' ) ) {
            do_action( 'yaymail_before_init' );
            \YayMail\Initialize::get_instance();
        }
        if ( defined( 'YAYMAIL_VERSION' ) && version_compare( YAYMAIL_VERSION, '4.4', '<' ) ) {
            add_action( 'admin_notices', 'YayMail\\update_yaymail_admin_notice' );
            return;
        }
        \YayMail\WP\Controllers\AddonWpMailController::get_instance();
    }
}//end if

if ( ! wp_installing() ) {
    add_action( 'plugins_loaded', 'YayMail\\wp_mail_init' );
}

register_activation_hook( __FILE__, [ \YayMail\Engine\ActDeact::class, 'activate' ] );
register_deactivation_hook( __FILE__, [ \YayMail\Engine\ActDeact::class, 'deactivate' ] );