import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { CrownFilled } from '@ant-design/icons';
import { Button } from 'antd';

import { getBrandName, isWpPlatform } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';

import './content.scss';

const UpgradeContent = ({ isCrossPage }: { isCrossPage?: boolean }) => {
  const location = useLocation();
  const brandName = getBrandName();
  const features = useMemo(
    () => {
      const list = [
        __('Get recent editing revisions', 'yaymail'),
        __('Custom fields & meta support', 'yaymail'),
        __('Save custom blocks for reuse', 'yaymail'),
        __('%s plugin integrations', 'yaymail').replace(
          '%s',
          `<a href="${
            window.yaymailData.urls.home_url
          }/wp-admin/admin.php?page=yaymail-settings#/go-pro#third-party-integrations" target="${
            isCrossPage ? '_blank' : '_self'
          }" id="view-third-party-integrations" rel="noopener noreferrer" style="text-decoration: underline; text-underline-offset: 2px;">` +
            __('30+ third-party', 'yaymail') +
            '</a>',
        ),
        __('Multilingual support', 'yaymail'),
        __('Fast updates', 'yaymail'),
        __('VIP live chat support', 'yaymail'),
      ];
      // The "Third-Party Plugins Supported" comparison section doesn't exist
      // on the WP platform, so this bullet would link to a dead anchor.
      return isWpPlatform() ? list.filter((_, index) => index !== 3) : list;
    },
    [isCrossPage],
  );

  useEffect(() => {
    function scrollToComparisonTable() {
      window.jQuery('html, body').animate({
        scrollTop: window.jQuery('#third-party-integrations').offset()?.top ?? 0,
      });
    }
    window.jQuery(document).on('click', '#view-third-party-integrations', scrollToComparisonTable);
    return () => {
      window
        .jQuery(document)
        .off('click', '#view-third-party-integrations', scrollToComparisonTable);
    };
  }, []);

  return (
    <div className="upgrade-content-container">
      <div className="upgrade-content__main">
        <div className="upgrade-content__header">
          <div className="upgrade-content__header-title">
            <h2>{sprintf(__('%s Pro!', 'yaymail'), brandName)}</h2>
            <span className="upgrade-content__header-title__badge">
              <CrownFilled />
              {__('Pro', 'yaymail')}
            </span>
          </div>
          <p className="upgrade-content__subtitle">
            {sprintf(
              /* translators: %s: brand name, e.g. YayMail or Email Builder */
              __('Get all features when you upgrade to %s Pro.', 'yaymail'),
              brandName,
            )}
          </p>
        </div>

        <div className="upgrade-content__features">
          <div className="upgrade-content__feature-group">
            <ul className="upgrade-content__feature-list">
              {features.map((feature, featureIndex) => (
                <li className="upgrade-content__feature-item" key={featureIndex}>
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="11" fill="#FEF5DA" />
                    <path d="M6 12L8.72727 15L16 7" fill="#FEF5DA" />
                    <path
                      d="M6 12L8.72727 15L16 7"
                      stroke="#FEC900"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <div dangerouslySetInnerHTML={{ __html: feature }}></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeContent;
