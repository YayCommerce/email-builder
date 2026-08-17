<?php

namespace YayMail\WP\Notices;

use YayMail\Utils\SingletonTrait;

defined( 'ABSPATH' ) || exit;

/**
 * SuggestYayMailNotice Class
 *
 * @method static SuggestYayMailNotice get_instance()
 */
class SuggestYayMailNotice {
    use SingletonTrait;

    protected function __construct() {

        if ( function_exists( 'WC' ) ) {
            add_action(
                'after_plugin_row_' . EMAIL_BUILDER_PLUGIN_BASENAME,
                [ $this, 'display_under_plugin_notices' ],
                10,
                2
            );
            add_action( 'admin_footer', [ $this, 'enqueue_admin_script' ] );
        }

        // Handle YayMail core installation
        add_action( 'admin_action_yaymail_install_core', [ $this, 'install_yaymail_core' ] );

        // Show admin notices after installation
        add_action( 'admin_notices', [ $this, 'show_install_notices' ] );
    }

    /**
     * Displays the required notices below the plugin row if dependencies are missing.
     *
     * @param string $plugin_file
     */
    public function display_under_plugin_notices( $plugin_file ) {
        if ( function_exists( 'YayMail\\init' ) ) {
            return;
            // No need to show notices if dependencies are met
        }

        $wp_list_table = _get_list_table( 'WP_MS_Themes_List_Table' );

        echo wp_kses_post(
            '<tr class="plugin-update-tr' . ( is_plugin_active( $plugin_file ) ? ' active' : '' ) . '">
                <td colspan="' . esc_attr( $wp_list_table->get_column_count() ) . '" class="plugin-update colspanchange">'
                . ( ! function_exists( 'YayMail\\init' ) && function_exists( 'WC' ) ? $this->get_core_required_notice() : '' )
                . '</td>
            </tr>'
        );
    }

    /**
     * Returns the notice for missing YayMail plugin.
     */
    protected function get_core_required_notice() {
        $yaymail_versions = [
            'yaymail-pro/yaymail.php',
            'email-customizer-for-woocommerce/yaymail.php',
            'yaymail/yaymail.php',
        ];

        $all_plugins        = get_plugins();
        $plugin_to_activate = null;

        foreach ( $yaymail_versions as $plugin_file ) {
            if ( array_key_exists( $plugin_file, $all_plugins ) && ! is_plugin_active( $plugin_file ) ) {
                $plugin_to_activate = $plugin_file;
                break;
            }
        }

        if ( $plugin_to_activate ) {
            $activate_url = wp_nonce_url(
                admin_url( 'plugins.php?action=activate&plugin=' . urlencode( $plugin_to_activate ) ),
                'activate-plugin_' . $plugin_to_activate
            );

            return sprintf(
                '<div class="notice inline notice-warning notice-alt"><p>%s <a href="%s">%s</a></p></div>',
                esc_html__( 'To customize WooCommerce emails, you need to activate YayMail plugin.', 'email-builder' ),
                esc_url( $activate_url ),
                esc_html__( 'Activate Now', 'email-builder' )
            );
        }

        $install_url = wp_nonce_url(
            admin_url( 'admin.php?action=yaymail_install_core' ),
            'yaymail-install-core'
        );

        return sprintf(
            '<div class="notice inline notice-warning notice-alt"><p>%s <a href="%s">%s</a> or <a target="_blank" href="%s">%s</a></p></div>',
            esc_html__( 'To customize WooCommerce emails, you need to install and activate YayMail plugin. Get', 'email-builder' ),
            esc_url( $install_url ),
            esc_html__( 'YayMail Free', 'email-builder' ),
            esc_url( 'https://yaycommerce.com/yaymail-woocommerce-email-customizer/' ),
            esc_html__( 'YayMail Pro', 'email-builder' )
        );
    }

    /**
     * Handles the installation of YayMail core plugin.
     */
    public function install_yaymail_core() {
        // Check user permissions
        if ( ! current_user_can( 'install_plugins' ) ) {
            wp_die( esc_html__( 'You do not have permission to install plugins.', 'email-builder' ) );
        }

        // Verify nonce
        check_admin_referer( 'yaymail-install-core' );

        // Include required WordPress files
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/misc.php';

        // Create upgrader instance
        $upgrader = new \Plugin_Upgrader( new \WP_Ajax_Upgrader_Skin() );

        // Install the plugin
        $download_url = 'https://downloads.wordpress.org/plugin/yaymail.zip';
        $result       = $upgrader->install( $download_url );

        // Check if installation was successful
        if ( is_wp_error( $result ) ) {
            wp_redirect( admin_url( 'plugins.php?yaymail-install-error=1' ) );
            exit;
        }

        // Try to activate the plugin
        $plugin_file     = 'yaymail/yaymail.php';
        $activate_result = activate_plugin( $plugin_file );

        if ( is_wp_error( $activate_result ) ) {
            wp_redirect( admin_url( 'plugins.php?yaymail-installed=1&yaymail-activate-error=1' ) );
            exit;
        }

        // Success - redirect back to plugins page
        wp_redirect( admin_url( 'plugins.php?yaymail-installed=1&yaymail-activated=1' ) );
        exit;
    }

    /**
     * Displays admin notices after plugin installation.
     */
    public function show_install_notices() {
        if ( isset( $_GET['yaymail-install-error'] ) ) {
            ?>
            <div class="notice notice-error is-dismissible">
                <p><?php esc_html_e( 'Failed to install YayMail plugin. Please try installing it manually from WordPress.org.', 'email-builder' ); ?></p>
            </div>
            <?php
        }

        if ( isset( $_GET['yaymail-installed'] ) && isset( $_GET['yaymail-activated'] ) ) {
            ?>
            <div class="notice notice-success is-dismissible">
                <p><?php esc_html_e( 'YayMail plugin has been successfully installed and activated!', 'email-builder' ); ?></p>
            </div>
            <?php
        } elseif ( isset( $_GET['yaymail-installed'] ) && isset( $_GET['yaymail-activate-error'] ) ) {
            ?>
            <div class="notice notice-warning is-dismissible">
                <p><?php esc_html_e( 'YayMail plugin was installed but could not be activated automatically. Please activate it manually.', 'email-builder' ); ?></p>
            </div>
            <?php
        }
    }

    /**
     * Enqueues a script to modify the plugin row styling in the admin footer.
     */
    public function enqueue_admin_script() {
        // Check is YayMail plugin installed
        if ( function_exists( 'YayMail\\init' ) ) {
            return;
        }
        ?>
        <script>
            document.addEventListener('DOMContentLoaded', function() {
                var pluginRow = document.querySelector('tr[data-plugin="<?php echo esc_js( YAYMAIL_PLUGIN_BASENAME ); ?>"]');
                if (pluginRow) pluginRow.classList.add('update');
            });
        </script>
        <?php
    }
}
