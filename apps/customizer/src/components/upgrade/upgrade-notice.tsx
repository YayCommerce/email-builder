import { useState } from 'react';

import { Button } from 'antd';

import { __ } from '@wordpress/i18n';

import Modal from './modal';

import './upgrade-notice.scss';

export default function UpgradeNotice() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <div className="yaymail-upgrade-notice">
        <span className="yaymail-upgrade-notice__text">
          {__('This feature available in PRO version.', 'yaymail')}
        </span>
        <Button type="primary" className="yaymail-upgrade-notice__button" onClick={handleOpenModal}>
          {__('Upgrade Now', 'yaymail')}
        </Button>
      </div>
      <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
    </>
  );
}
