<?php

namespace YayMail\WP\Emails;

use YayMail\Abstracts\BaseEmail;
use YayMail\Elements\ElementsLoader;
use YayMail\Utils\SingletonTrait;
use YayMail\WP\Utils\DefaultElement;

/**
 * GlobalHeaderFooter Class
 *
 * This is an YayMail element, not an email template. But its customizer page (for editing, saving, etc...) shares the same logic as email template customizer.
 *
 * @method static GlobalHeaderFooter get_instance()
 */
class GlobalHeaderFooter extends BaseEmail {
    use SingletonTrait;

    public $email_types = [ YAYMAIL_GLOBAL_HEADER_FOOTER_ID ];

    protected function __construct() {
        $this->id        = 'wp_global_header_footer';
        $this->title     = __( 'Global header footer', 'yaymail' );
        $this->recipient = __( 'Global header footer recipient placeholder', 'yaymail' );
    }

    public function get_default_elements() {
        return ElementsLoader::load_elements(
            [
                [
                    'type'       => 'Heading',
                    'attributes' => [
                        'background_color' => '#fff',
                        'text_color'       => '#000000',
                    ],
                ],
                [ 'type' => 'SkeletonDivider' ],
                [
                    'type'       => 'Footer',
                    'attributes' => [
                        'background_color' => '#fff',
                        'rich_text'        => '<p style="text-align: center;"><span>For questions, please contact <admin email> us during operating hours for support.</span><br /><span><a style="font-weight: normal; text-decoration: underline;" href="[yaymail_site_url]" target="_blank" rel="noopener">[yaymail_site_name]</a></span></p>',
                    ],
                ],
            ]
        );
    }

    public function get_all_elements() {
        return parent::get_elements();
    }

    public function get_template_file( $located, $template_name, $args ) {
    }

    public function get_template_path() {
    }
}
