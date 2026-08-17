import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import { ReactComponent as NoticeIcon } from '../notice-icon.svg';

const AddonNeededNotice = () => {
  const templateData = useCustomizerPageStore((state) => state.templateData);

  const url = templateData?.addon_info?.link_upgrade ?? '';
  return (
    <div>
      <i className="yaymail-notice-icon">
        <NoticeIcon />
      </i>
      <p>
        <span>
          {__(
            ' This email template can be fully customized with YayMail Premium Addon. ',
            'yaymail',
          )}
        </span>
        <a
          style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          className="yaymail-link-upgrade"
          href={url}
          target="_blank"
          onClick={(event) => {
            event.stopPropagation();
          }}
          rel="noreferrer"
        >
          {__('Buy Now', 'yaymail')}
        </a>
      </p>
    </div>
  );
};

export default AddonNeededNotice;
