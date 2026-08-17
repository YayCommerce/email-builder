<?php

use YayMail\WP\Emails\WpMail;

defined( 'ABSPATH' ) || exit;

$template = WpMail::get_instance()->template;

if ( ! empty( $template ) ) {
    $render_data = isset( $args['render_data'] ) ? $args['render_data'] : $args;
    $content     = $template->get_content( $render_data );
    yaymail_kses_post_e( $content );
}
