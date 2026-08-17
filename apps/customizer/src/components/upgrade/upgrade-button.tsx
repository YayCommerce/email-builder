import { useState } from 'react';

import { Button } from 'antd';

import { __ } from '@wordpress/i18n';

import Modal from './modal';

export default function UpgradeButton() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Button type="primary" className="yaymail-upgrade-notice__button" onClick={handleOpenModal}>
        {__('Upgrade Now', 'yaymail')}
      </Button>
      <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
    </>
  );
}
