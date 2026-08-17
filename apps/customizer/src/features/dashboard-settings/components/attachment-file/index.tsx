import React from 'react';

import BuyNowButton from '@src/components/upgrade/buy-now-button';

import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import { ReactComponent as PreviewAttachmentProIcon } from '@src/assets/svgs/preview-attachment-pro.svg';
import { getEmailSystemName } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';
const AttachmentFile: React.FC = () => {
  const navigateWithConfirmation = useNavigationWithConfirmation();

  return (
    <>
      <h3 className="yaymail-settings__title">{__('Attachments', 'yaymail')}</h3>
      <p className="yaymail-settings__description">
        {sprintf(
          /* translators: %s: email system name, e.g. WooCommerce or WordPress */
          __(
            'Add custom attachments to your %s emails to enhance your customer communication.',
            'yaymail',
          ),
          getEmailSystemName(),
        )}
        <br />
        {__(
          'This feature lets you include important files such as invoices, product guides, terms and conditions, coupons, or personalized documents with your order confirmation, shipping, or general notification emails.',
          'yaymail',
        )}
        <br />
        <a
          href="https://docs.yaycommerce.com/yaymail/how-it-works/settings#id-3-.-attachments-pro"
          target="_blank"
          style={{ color: 'currentcolor', textDecoration: 'underline', textUnderlineOffset: '2px' }} rel="noreferrer"
        >
          {__('See how it works', 'yaymail')}
        </a>
      </p>
      <PreviewAttachmentProIcon
        style={{
          width: 500,
          maxWidth: '100%',
          marginBottom: '1.5rem',
          display: 'block',
        }}
      />
      <BuyNowButton href={undefined} onClick={() => navigateWithConfirmation('/go-pro')} />
    </>
  );
};

export default AttachmentFile;
