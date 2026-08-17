import { getPlatform } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';

import AddonsProvider from './addons-provider';
import SearchAddons from './search-addons';
import AddonsTable from './table';

import './index.scss';

/**
 * Label for Addons marketing copy: Woo-only, WP-only, or both (WordPress/WooCommerce).
 * Falls back to WooCommerce when platform is missing (legacy localize).
 */
function getAddonsPlatformLabel(platform: string): string {
  if (platform === 'email-builder') {
    return 'WordPress';
  }
  return 'WooCommerce';
}

function getCustomizerName(platform: string): string {
  if (platform === 'email-builder') {
    return 'Email Builder';
  }
  return 'Email Customizer';
}

export default function AddonsLayout() {
  const platform = getPlatform();
  const platformLabel = getAddonsPlatformLabel(platform);
  const customizerName = getCustomizerName(platform);

  return (
    <AddonsProvider>
      <div className="yaymail-addons-container">
        <div className="yaymail-addons-header">
          <h2 className="yaymail-addons-header__title">
            {sprintf(
              /* translators: %s: platform name e.g. WooCommerce, WordPress, or WordPress/WooCommerce */
              __('Explore %s %s %s Addons', 'yaymail'),
              platform === 'yaymail' ? '80+' : '',
              platformLabel,
              customizerName,
            )}
          </h2>
          <p className="yaymail-addons-header__description">
            {sprintf(
              /* translators: %s: platform name e.g. WooCommerce, WordPress, or WordPress/WooCommerce */
              __('Connect extensions to create custom %s emails with %s!', 'yaymail'),
              platformLabel,
              platform === 'yaymail' ? 'YayMail' : 'Email Builder',
            )}
          </p>
          <SearchAddons />
        </div>
        <AddonsTable />
      </div>
    </AddonsProvider>
  );
}
