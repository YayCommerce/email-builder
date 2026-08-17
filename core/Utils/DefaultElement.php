<?php

namespace YayMail\WP\Utils;

/**
 * Default Element
 */
class DefaultElement {

    /**
     * Get site icon or custom logo URL for email header.
     * Prefers Site Icon (favicon); falls back to Custom Logo if set.
     *
     * @return string
     */
    private static function get_site_icon_or_logo_url() {
        $url = get_site_icon_url( 512 );
        if ( ! empty( $url ) ) {
            return $url;
        }
        if ( function_exists( 'has_custom_logo' ) && has_custom_logo() ) {
            $logo_id = get_theme_mod( 'custom_logo' );
            if ( $logo_id ) {
                $logo_url = wp_get_attachment_image_url( $logo_id, 'full' );
                if ( $logo_url ) {
                    return $logo_url;
                }
            }
        }
        return '';
    }

    /**
     * Default header elements
     *
     * @return array
     */
    public static function default_header_elements() {
        $site_icon    = self::get_site_icon_or_logo_url();
        $site_title   = get_bloginfo( 'name' );
        $site_tagline = get_bloginfo( 'description' );

        $header_elements = [];
        if ( ! empty( $site_icon ) ) {
            $header_elements[] = [
                'type'       => 'Logo',
                'attributes' => [
                    'background_color' => '#ffffff',
                    'src'              => $site_icon,
                ],
            ];
        }

        if ( ! empty( $site_title ) || ! empty( $site_tagline ) ) {
            $header_elements[] = [
                'type'       => 'Title',
                'attributes' => [
                    'title'    => ! empty( $site_title ) ? $site_title : '',
                    'subtitle' => ! empty( $site_tagline ) ? $site_tagline : '',
                ],
            ];
        }

        return $header_elements;
    }

    /**
     * Default footer elements
     *
     * @return array
     */
    public static function default_footer_elements() {
        return [
            [
                'type'       => 'Divider',
                'attributes' => [
                    'height'        => 1,
                    'divider_color' => '#abb8c3',
                    'padding'       => [
                        'top'    => 0,
                        'right'  => 50,
                        'bottom' => 0,
                        'left'   => 50,
                    ],
                ],
            ],
            [
                'type'       => 'Text',
                'attributes' => [
                    'rich_text' => '<p style="text-align: center;"><span>For questions, please contact <admin email> us during operating hours for support.</span></p>',
                    'padding'   => [
                        'top'    => 15,
                        'right'  => 50,
                        'bottom' => 0,
                        'left'   => 50,
                    ],
                ],
            ],
            [
                'type'       => 'Text',
                'attributes' => [
                    'rich_text' => '<p style="font-size: 14px;margin: 0px 0px 16px; text-align: center;"><a style="font-weight: normal; text-decoration: underline;" href="[yaymail_site_url]" target="_blank" rel="noopener">[yaymail_site_name]</a></p>',
                    'padding'   => [
                        'top'    => 0,
                        'right'  => 50,
                        'bottom' => 15,
                        'left'   => 50,
                    ],
                ],
            ],
        ];
    }

    /**
     * Default email content elements
     *
     * @return array
     */
    public static function default_email_content_elements() {
        return [
            ...self::default_header_elements(),
            [
                'type'       => 'Text',
                'attributes' => [
                    'rich_text' => '[yaymail_wp_mail_content]',
                ],
            ],
            ...self::default_footer_elements(),
        ];
    }
}
