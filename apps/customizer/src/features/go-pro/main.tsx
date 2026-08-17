import BuyNowButton from '@src/components/upgrade/buy-now-button';
import UpgradeContent from '@src/components/upgrade/content';

import { getBrandName } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';

import Comparison from './comparison';

import './index.scss';

const bgImage = window.yaymailData.urls.asset_url + 'go-pro-background.png';

export default function GoProLayout() {
  const brandName = getBrandName();
  return (
    <div className="yaymail-go-pro-container">
      <div className="yaymail-go-pro__main">
        <div
          className="yaymail-go-pro__main__content"
          style={{
            background: `url("${bgImage}")`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <h1 className="yaymail-go-pro__main__content__title">
            {sprintf(
              /* translators: %s: brand name, e.g. YayMail or Email Builder */
              __('Upgrade to %s Pro', 'yaymail'),
              brandName,
            )}
          </h1>
          <p className="yaymail-go-pro__main__content__description">
            {sprintf(
              /* translators: %s: brand name, e.g. YayMail or Email Builder */
              __(
                'Consider upgrading to %s Pro? It would be the best move you can make for your ecommerce store.',
                'yaymail',
              ),
              brandName,
            )}
          </p>
          <BuyNowButton />
        </div>
        <div className="yaymail-go-pro__main__sub-content">
          <UpgradeContent />
        </div>
      </div>
      <div className="yaymail-go-pro__comparison-wrapper">
        <Comparison />
      </div>
    </div>
  );
}
