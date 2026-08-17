<?php
namespace YayMail\Models;

use YayMail\SupportedPlugins;

/**
 * Migration Model
 *
 * @method static MigrationModel get_instance()
 */
class AddonModel {

    public static function get_all() {
        $data = [];

        $data = apply_filters( 'yaymail_addon_supported_plugins', $data );

        foreach ( array_keys( $data ) as $namespace ) {
            $data[ $namespace ]['installation_status']              = [];
            $data[ $namespace ]['installation_status']['is_active'] = function_exists( $namespace . '\init' ) || function_exists( $namespace . '\addon_init' );
        }

        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
        require_once ABSPATH . 'wp-admin/includes/class-wp-ajax-upgrader-skin.php';
        require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';

        foreach ( $data as $namespace => $addon ) {
            $data[ $namespace ]['installation_status']['is_installed'] = false;
            if ( isset( $addon['plugin_slug'] ) ) {
                $plugin_status = \install_plugin_install_status(
                    [
                        'slug'    => $addon['plugin_slug'],
                        'version' => '',
                    ]
                );
                $data[ $namespace ]['installation_status']['is_installed'] = $plugin_status['file'] !== false;
                $data[ $namespace ]['installation_status']['plugin_file']  = $plugin_status['file'];
            }
        }
        return $data;
    }

    public static function get_3rd_party_addons() {
        return array_filter(
            self::get_all(),
            function( $addon ) {
                return isset( $addon['is_3rd_party_installed'] );
            }
        );
    }

    public static function get_template_ids( array $template_names ): array {
        if ( ! function_exists( 'WC' ) || ! class_exists( 'WC_Emails' ) ) {
            return [];
        }

        return array_filter(
            array_map(
                function ( $template_name ) {
                    return \WC_Emails::instance()->get_emails()[ $template_name ]->id ?? null;
                },
                $template_names
            )
        );
    }

    public static function get_follow_up_email_ids() {
        if ( ! is_callable( 'fue_get_emails' ) ) {
            return [];
        }

        $follow_ups_emails = \fue_get_emails( 'any', [ 'fue-active' ] );
        $follow_ups_emails = array_filter(
            $follow_ups_emails,
            function ( $email ) {
                return $email->status === 'fue-active';
            }
        );

        if ( empty( $follow_ups_emails ) ) {
            return [];
        }

        return array_map(
            function ( $fue_email ) {
                return 'follow_up_email_' . $fue_email->id;
            },
            $follow_ups_emails
        );
    }

    public static function get_automatewoo_template_ids() {
        if ( ! class_exists( 'AutomateWoo\Workflow_Query' ) ) {
            return [];
        }

        $query = new \AutomateWoo\Workflow_Query();
        $query->set_return( 'ids' );
        $ids = $query->get_results();

        if ( empty( $ids ) ) {
            return [];
        }

        $workflows = [];

        foreach ( $ids as $id ) {
            $workflow = \AutomateWoo\Workflows\Factory::get( $id );
            if ( $workflow ) {
                $workflows[] = $workflow;
            }
        }

        $template_ids = [];

        foreach ( $workflows as $workflow ) {
            $actions = $workflow->get_actions();
            foreach ( $actions as $action_index => $action ) {
                $workflow_id = $workflow->get_id();
                $name        = 'AutomateWoo_' . $workflow_id;
                if ( $action_index !== null ) {
                    $name .= '_action_' . $action_index;
                }
                $template_ids[] = $name;
            }
        }

        return $template_ids;
    }

    public static function get_shopmagic_template_ids() {
        if ( ! class_exists( 'YayMailAddonSMFW\Emails\EmailsCreation' ) ) {
            return [];
        }

        $emails = \YayMailAddonSMFW\Emails\EmailsCreation::get_instance()->get_emails();

        if ( empty( $emails ) ) {
            return [];
        }

        return array_filter(
            array_map(
                function ( $email ) {
                    return $email->get_id();
                },
                $emails
            )
        );
    }

    public static function get_wcfmvm_template_ids() {
        if ( ! function_exists( 'get_wcfmvm_emails' ) ) {
            return [];
        }
        $emails = get_wcfmvm_emails();
        return array_filter( array_keys( $emails ) );
    }

    public static function get_wc_cart_abandonment_recovery_template_ids() {
        if ( ! class_exists( 'YayMailAddonWcCartAbandonmentRecovery\EmailCreation' ) ) {
            return [];
        }
        $emails = \YayMailAddonWcCartAbandonmentRecovery\EmailCreation::get_instance()->get_emails();

        if ( empty( $emails ) ) {
            return [];
        }

        return array_filter(
            array_map(
                function ( $email ) {
                    return $email->get_id();
                },
                $emails
            )
        );
    }
}
