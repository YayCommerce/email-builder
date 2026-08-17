<?php

namespace YayMail\WP\Emails;

use YayMail\YayMailTemplate;
use YayMail\Abstracts\BaseEmail;
use YayMail\Elements\ElementsLoader;
use YayMail\Utils\SingletonTrait;
use YayMail\WP\Utils\DefaultElement;

/**
 * WpMail Class
 *
 * @method static WpMail get_instance()
 */
class WpMail extends BaseEmail {

    use SingletonTrait;

    public $email_types = [ YAYMAIL_NON_ORDER_EMAILS ];

    protected function __construct() {
        $this->id         = 'wp-core-mail';
        $this->title      = esc_html__( 'WordPress Mail (Fallback for all WP Email)', 'email-builder' );
        $this->root_email = null;
        $this->recipient  = __( 'Recipient', 'email-builder' );
        $this->source     = [
            'plugin_id'   => 'email-builder',
            'plugin_name' => 'WordPress Email',
        ];

        $this->render_priority = apply_filters( 'yaymail_email_render_priority', 10, $this->id );
        add_filter( 'wp_mail', [ $this, 'custom_wp_mail_body' ], $this->render_priority );
    }

    public function get_default_elements() {
        return ElementsLoader::load_elements( DefaultElement::default_email_content_elements() );
    }


    public function custom_wp_mail_body( $args ) {
        if ( empty( $args['message'] ) || ! is_string( $args['message'] ) ) {
            return $args;
        }

        $message = $args['message'];

        $excluded_marker = '<!-- yaymail:wp-has-template-email-content -->';

        if ( strpos( $message, $excluded_marker ) !== false ) {
            $message = substr( $message, strlen( $excluded_marker ) );
            // Ensure the email is sent as HTML.
            if ( ! is_array( $args['headers'] ) ) {
                $args['headers'] = [];
            }
            $args['headers'][] = 'Content-Type: text/html; charset=UTF-8';
            $args['message']   = $message;
            return $args;
        }

        $template_path = $this->get_template_path();
        if ( ! file_exists( $template_path ) ) {
            return $args;
        }

        $language       = apply_filters( 'yaymail_email_get_language', $this->get_language( null ), null, $args, $this );
        $this->template = new YayMailTemplate( $this->id, $language );

        if ( ! $this->template->is_enabled() ) {
            return $args;
        }

        $args['render_data'] = [
            'content' => $message,
        ];

        ob_start();
        include $template_path;
        $content = ob_get_contents();
        ob_end_clean();

        $content         = apply_filters( 'yaymail_wp_mail_message_before_send', $content, $args );
        $args['message'] = $content;
        if ( ! is_array( $args['headers'] ) ) {
            $args['headers'] = [];
        }
        $args['headers'][] = 'Content-Type: text/html; charset=UTF-8';

        return $args;
    }

    public function get_template_path() {
        return EMAIL_BUILDER_PLUGIN_PATH . 'core/Templates/wp-mail.php';
    }
}
