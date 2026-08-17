<?php

namespace YayMail\WP\Shortcodes;

use YayMail\Abstracts\BaseShortcode;
use YayMail\Utils\SingletonTrait;


/**
 * @method: static WPShortcodes get_instance()
 */
class WPShortcodes extends BaseShortcode {
    use SingletonTrait;

    protected function __construct() {
        $this->available_email_ids = [
            \YayMail\WP\Emails\WpMail::get_instance()->get_id(),
        ];
        parent::__construct();
    }

    public function get_shortcodes() {
        $shortcodes = [];

        $shortcodes [] = [
            'name'        => 'yaymail_wp_mail_content',
            'description' => __( 'WP - Mail Content', 'email-builder' ),
            'group'       => 'email-builder',
            'callback'    => [ $this, 'yaymail_wp_mail_content' ],
        ];

        return $shortcodes;
    }

    public function yaymail_wp_mail_content( $args ) {
        $render_data = isset( $args['render_data'] ) ? $args['render_data'] : [];
        $is_sample   = isset( $render_data['is_sample'] ) ? $render_data['is_sample'] : false;
        if ( $is_sample ) {
            return __( 'Your email content just looks like: Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', 'email-builder' );
        }
        // Support both flat render_data and nested (e.g. render_data.render_data from some code paths).
        $content = null;
        if ( isset( $render_data['content'] ) && is_string( $render_data['content'] ) ) {
            $content = $render_data['content'];
        } elseif ( isset( $render_data['render_data']['content'] ) && is_string( $render_data['render_data']['content'] ) ) {
            $content = $render_data['render_data']['content'];
        }
        if ( $content !== null ) {
            // return wp_kses_post( wpautop( wptexturize( $content ) ) );
            // if content is html, return only the body inner html
            if ( preg_match( '/<body\b[^>]*>([\s\S]*?)<\/body>/i', $content, $matches ) ) {
                return wp_kses_post( $matches[1] );
            }
            return wp_kses_post( wpautop( wptexturize( $content ) ) );

        }
        return '';
    }
}
