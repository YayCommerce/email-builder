<?php

namespace YayMail\Integrations;

use YayMail\Utils\SingletonTrait;
/**
 * IntegrationsLoader
 * * @method static IntegrationsLoader get_instance()
 */
class IntegrationsLoader {
    use SingletonTrait;

    protected function __construct() {
        RankMath::get_instance();
    }
}
