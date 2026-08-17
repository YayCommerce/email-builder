import { useEffect, useState } from 'react';

import BuyNowButton from '@src/components/upgrade/buy-now-button';

import { getBrandName, isWpPlatform } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';

import './comparison.scss';

function getFeatures(isWp: boolean) {
  const generalFeaturesGroup = {
    title: __('General Features', 'yaymail'),
    id: 'general-features',
    items: [
      {
        title: isWp
          ? __('x standard WordPress emails', 'yaymail')
          : __('11 standard WooCommerce emails', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Full customizability', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Global styling options', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Live preview editor', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Send test emails', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Export/Import templates', 'yaymail'),
        upgrade: false,
      },
      {
        title: isWp
          ? __('Shortcode for WordPress data', 'yaymail')
          : __('Shortcode for WooCommerce data', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Predesigned patterns', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Developer API', 'yaymail'),
        upgrade: false,
      },
      {
        title: __('Synced patterns', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Global colors', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Email attachments', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Advanced blocks with dynamic data', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Full edit history', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Fast updates & bug fixes', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('1-1 live chat VIP support', 'yaymail'),
        upgrade: true,
      },
    ],
  };

  // WordPress core has no notion of "third-party plugins" the way
  // WooCommerce does, so this comparison group doesn't apply on the WP
  // platform.
  const thirdPartyPluginsGroup = {
    title: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span>{__('Third-Party Plugins Supported', 'yaymail')}</span>
        <a
          href="https://docs.yaycommerce.com/yaymail/integrations"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_4418_9119)">
              <path
                d="M3.27 12C2.48 11.05 2 9.83 2 8.5C2 5.48 4.47 3 7.5 3H12.5C15.52 3 18 5.48 18 8.5C18 11.52 15.53 14 12.5 14H10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.73 12C21.52 12.95 22 14.17 22 15.5C22 18.52 19.53 21 16.5 21H11.5C8.48 21 6 18.52 6 15.5C6 12.48 8.47 10 11.5 10H14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_4418_9119">
                <rect width="24" height="24" fill="none" />
              </clipPath>
            </defs>
          </svg>
        </a>
      </span>
    ),
    id: 'third-party-integrations',
    items: [
      {
        title: __('Shipment & order tracking', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Custom order status', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Checkout field editor', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Payments & payment gateways', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Custom shipping plugins', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Multi-language & translation plugins', 'yaymail'),
        upgrade: true,
      },
    ],
  };

  const multiLanguageGroup = {
    title: __('Multi Language', 'yaymail'),
    id: 'multi-language',
    items: [
      {
        title: __('WPML', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Polylang', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('TranslatePress', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('GTranslate', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Weglot', 'yaymail'),
        upgrade: true,
      },
      {
        title: __('Loco Translate', 'yaymail'),
        upgrade: true,
      },
    ],
  };

  return isWp
    ? [generalFeaturesGroup, multiLanguageGroup]
    : [generalFeaturesGroup, thirdPartyPluginsGroup, multiLanguageGroup];
}

const tickIcon = (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11.5" cy="11.5" r="11" fill="#FEF5DA" />
    <path d="M6.5 12.5L9.22727 15.5L16.5 7.5" fill="#FEF5DA" />
    <path
      d="M6.5 12.5L9.22727 15.5L16.5 7.5"
      stroke="#FEC900"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const crossIcon = (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      opacity="0.5"
      d="M11.5 22.5C17.5751 22.5 22.5 17.5751 22.5 11.5C22.5 5.42487 17.5751 0.5 11.5 0.5C5.42487 0.5 0.5 5.42487 0.5 11.5C0.5 17.5751 5.42487 22.5 11.5 22.5Z"
      fill="#E8EAF0"
    />
    <path
      d="M15.5 7.49976L7.5 15.4998"
      stroke="#AAACBA"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 7.49976L15.5 15.4998"
      stroke="#AAACBA"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Comparison() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const brandName = getBrandName();
  const features = getFeatures(isWpPlatform());
  useEffect(() => {
    if (!document.querySelector('.yaymail-header__navbar')) {
      return;
    }
    const headerHeight = window.jQuery('.yaymail-header__navbar').innerHeight() || 0;
    setHeaderHeight(headerHeight);
  }, []);
  return (
    <div className="yaymail-go-pro__comparison">
      <h2 className="yaymail-go-pro__comparison__title">
        {__('Compare Plans & Features', 'yaymail')}
      </h2>
      <p className="yaymail-go-pro__comparison__description">
        {__('Explore our clear comparison table to see the features of each plan.', 'yaymail')}
      </p>
      <div className="yaymail-go-pro__comparison__table-container" id="comparison-table">
        {features.map((featureGroup, groupIndex) => (
          <div
            className="yaymail-go-pro__comparison__table-group"
            key={groupIndex}
            style={groupIndex === features.length - 1 ? { marginBottom: 0 } : {}}
            id={featureGroup.id}
          >
            <div
              className="yaymail-go-pro__comparison__table-group-title yaymail-go-pro__comparison__table-item"
              style={{
                top: `calc( ${headerHeight}px + var(--yaymail-wp-adminBar-height-lg) + 20px )`,
              }}
            >
              <div className="yaymail-go-pro__comparison__table-item__name">
                {featureGroup.title}
              </div>
              <div className="yaymail-go-pro__comparison__table-item__yaymail-free">
                {sprintf(__('%s Free', 'yaymail'), brandName)}
              </div>
              <div className="yaymail-go-pro__comparison__table-item__yaymail-pro">
                {sprintf(__('%s Pro', 'yaymail'), brandName)}
              </div>
              <div className="yaymail-go-pro__comparison__table-item__placeholder"></div>
            </div>
            {featureGroup.items.map((item, itemIndex) => (
              <div
                className="yaymail-go-pro__comparison__table-item"
                key={`item-${groupIndex}-${itemIndex}`}
              >
                <div className="yaymail-go-pro__comparison__table-item__name">{item.title}</div>
                <div className="yaymail-go-pro__comparison__table-item__yaymail-free">
                  {!item.upgrade ? tickIcon : crossIcon}
                </div>
                <div className="yaymail-go-pro__comparison__table-item__yaymail-pro">
                  {tickIcon}
                </div>
                <div className="yaymail-go-pro__comparison__table-item__placeholder"></div>
              </div>
            ))}
          </div>
        ))}
        <div className="yaymail-go-pro__comparison__table-group">
          <div className="yaymail-go-pro__comparison__table-item">
            <div className="yaymail-go-pro__comparison__table-item__name"></div>
            <div className="yaymail-go-pro__comparison__table-item__yaymail-free">
              <BuyNowButton
                className="yaymail-go-pro__comparison__table__current-plan-button"
                disabled
              >
                {__('Your current', 'yaymail')}
              </BuyNowButton>
            </div>
            <div className="yaymail-go-pro__comparison__table-item__yaymail-pro">
              <BuyNowButton />
            </div>
            <div className="yaymail-go-pro__comparison__table-item__placeholder"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
