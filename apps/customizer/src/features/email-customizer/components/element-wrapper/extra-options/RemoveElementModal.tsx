/* eslint-disable no-restricted-imports */
import React from 'react';

import { Modal } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import { IElement } from '@src/features/email-customizer/type';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';

interface IModalProps {
  elementIds: IElement['id'][];
  isOpen: boolean;
  onClose: () => void;
}

const HeaderContent = () => {
  return (
    <>
      <h4 className={styles['modal_header_title']}>
        {__('Are you sure you want to remove this element?', 'yaymail')}
      </h4>
    </>
  );
};

const RemoveElementModal: React.FC<IModalProps> = ({ elementIds, isOpen, onClose }) => {
  const removeElements = useTemplateContentStore((state) => state.removeElements);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    removeElements(elementIds);
    onClose();
  };

  return (
    <Modal
      title={<ModalHeader content={<HeaderContent />} />}
      className="yaymail-global__modal yaymail-remove-element__modal"
      open={isOpen}
      onCancel={onClose}
      centered
      width={'500px'}
      footer={<ModalFooter onOk={handleOk} onCancel={handleCancel} okText="Yes, sure!" />}
      destroyOnClose
    />
  );
};

export default RemoveElementModal;
