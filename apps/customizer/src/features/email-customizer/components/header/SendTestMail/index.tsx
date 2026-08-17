import React, { useState } from 'react';

import { Button, Tooltip } from 'antd';

import { ReactComponent as SendEmailIcon } from '@src/assets/svgs/send-email-icon.svg';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import Modal from './Modal';

const SendTestMail: React.FC = () => {
  const isEditable = useCustomizerPageStore(
    (s) => s.templateData?.support_status === 'already_supported',
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className="header__btn--action">
      <Tooltip placement="bottom" title={__('Send test email', 'yaymail')}>
        <Button onClick={handleOpenModal} disabled={!isEditable} className="yaymail-btn--icon-only">
          <span className="anticon" style={{ display: 'none' }}>
            <SendEmailIcon />
          </span>
          <span className='yaymail-btn--text' style={{color: 'initial'}}>{__('Send test email', 'yaymail')}</span>
        </Button>
      </Tooltip>
    
      {isEditable && (
        <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SendTestMail;
