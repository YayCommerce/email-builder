import React from 'react';

import { Modal as AntModal } from 'antd';

import { ModalHeader } from '@src/components/modal-header-footer';

import { __ } from '@wordpress/i18n';

import UpgradeContent from './content';

import styles from '@src/components/modal-header-footer/styles.module.scss';
import BuyNowButton from './buy-now-button';
import './Modal.scss';
interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HeaderContent = () => {
  return (
    <>
      <h4 className={styles['modal_header_title']}>
        {__('Smart move — you’re going to love what’s next.', 'yaymail')}
      </h4>
    </>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <>
      <AntModal
        title={<ModalHeader content={<HeaderContent />} />}
        className="yaymail-global__modal yaymail-go-pro__modal"
        open={isOpen}
        onCancel={handleCloseModal}
        centered
        footer={null}
      >
        <div className="modal__content">
          <UpgradeContent isCrossPage />
          <BuyNowButton />
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
