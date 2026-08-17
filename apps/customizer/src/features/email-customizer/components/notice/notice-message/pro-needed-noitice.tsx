import { __ } from '@wordpress/i18n';

import { ReactComponent as NoticeIcon } from '../notice-icon.svg';

const ProNeededNotice = () => {
  return (
    <div>
      <i className="yaymail-notice-icon">
        <NoticeIcon />
      </i>
      <p>
        <span>
          {' '}
          {__(' This email template can be fully customized with YayMail Pro. ', 'yaymail')}
        </span>
        <a
          style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          className="yaymail-link-upgrade"
          href="https://yaycommerce.com/yaymail-woocommerce-email-customizer/"
          target="_blank"
          onClick={(event) => {
            event.stopPropagation();
          }}
          rel="noreferrer"
        >
          {__('Upgrade Now', 'yaymail')}
        </a>
      </p>
    </div>
  );
};

export default ProNeededNotice;
