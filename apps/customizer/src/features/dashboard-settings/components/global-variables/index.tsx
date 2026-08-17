import BuyNowButton from '@src/components/upgrade/buy-now-button';

import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import { __ } from '@wordpress/i18n';

const GlobalVariables = () => {
  const navigateWithConfirmation = useNavigationWithConfirmation();

  return (
    <>
      <h3 className="yaymail-settings__title">{__('Global variables', 'yaymail')}</h3>
      <p style={{ marginBottom: '12px' }} className="yaymail-settings__description">
        {__(
          'Set up global variables like colors and more, then reuse them across multiple email templates for a consistent design.',
          'yaymail',
        )}
        <br />
        <a
          href="https://docs.yaycommerce.com/yaymail/how-it-works/settings#id-2-.-global-variables-pro"
          target="_blank"
          style={{ color: 'currentcolor', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {__('See how it works', 'yaymail')}
        </a>
      </p>
      <img
        src={window.yaymailData.urls.asset_url + '/global-variables-mockup.webp'}
        alt={__('Global variables', 'yaymail')}
        style={{ width: 500, maxWidth: '100%', marginBottom: '1.5rem', display: 'block' }}
      />
      <BuyNowButton href={undefined} onClick={() => navigateWithConfirmation('/go-pro')} />
    </>
  );
};

export default GlobalVariables;
