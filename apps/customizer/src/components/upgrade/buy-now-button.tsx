import { Button, ButtonProps } from 'antd';

import { getBrandName, isWpPlatform } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';

import './buy-now-button.scss';

const upgradeUrl = isWpPlatform()
  ? 'https://yaycommerce.com/support/'
  : 'https://yaycommerce.com/yaymail-woocommerce-email-customizer/';

export default function BuyNowButton(props: ButtonProps) {
  return (
    <Button
      type="primary"
      href={upgradeUrl}
      target="_blank"
      {...props}
      className={`yaymail-go-pro__buy-now-button ${props.className}`}
    >
      {props.children
        ? props.children
        : sprintf(
            /* translators: %s: brand name, e.g. YayMail or Email Builder */
            __('Get %s Pro', 'yaymail'),
            getBrandName(),
          )}
    </Button>
  );
}
