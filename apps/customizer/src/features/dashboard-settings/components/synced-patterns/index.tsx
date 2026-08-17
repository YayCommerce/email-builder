import BuyNowButton from '@src/components/upgrade/buy-now-button';

import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import { __ } from '@wordpress/i18n';

const SyncedPatterns = () => {
  const navigateWithConfirmation = useNavigationWithConfirmation();

  return (
    <>
      <h3 className="yaymail-settings__title">{__('Synced patterns', 'yaymail')}</h3>
      <p className="yaymail-settings__description">
        {__(
          'Create reusable patterns and keep them in sync across multiple emails to save time and maintain consistent, professional designs.',
          'yaymail',
        )}
        <br />
        <a
          href="https://docs.yaycommerce.com/yaymail/how-it-works/settings#id-1-.-synced-patterns-pro"
          target="_blank"
          style={{ color: 'currentcolor', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          {__('See how it works', 'yaymail')}
        </a>
      </p>
      <img
        src={window.yaymailData.urls.asset_url + '/synced-patterns-mockup.png'}
        alt="Synced patterns"
        style={{ width: 500, maxWidth: '100%', marginBottom: '1.5rem', display: 'block' }}
      />
      <BuyNowButton href={undefined} onClick={() => navigateWithConfirmation('/go-pro')} />
    </>
  );
};

export default SyncedPatterns;
