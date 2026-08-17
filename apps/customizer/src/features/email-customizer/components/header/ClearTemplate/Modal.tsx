import React from 'react';

import { Modal as AntModal } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';
import useCustomizerPageStore from '@src/stores/customizerPage';

interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HeaderContent = () => {
  return (
    <h4 className={styles['modal_header_title']}>
      {__('Are you sure you want to empty this template?', 'yaymail')}
    </h4>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const removeAllElements = useTemplateContentStore((state) => state.removeAllElements);
  const hideTemplateGlobalHeader = useCustomizerPageStore(
    (state) => state.hideTemplateGlobalHeader,
  );
  const hideTemplateGlobalFooter = useCustomizerPageStore(
    (state) => state.hideTemplateGlobalFooter,
  );

  const handleOk = () => {
    removeAllElements(['skeleton_divider']);
    hideTemplateGlobalHeader(true);
    hideTemplateGlobalFooter(true);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <AntModal
      title={<ModalHeader content={<HeaderContent />} />}
      className="yaymail-global__modal yaymail-blank-template__modal"
      open={isOpen}
      onCancel={onClose}
      centered
      width={'500px'}
      footer={<ModalFooter onOk={handleOk} onCancel={handleCancel} okText={'Empty'} />}
      destroyOnClose
    >
      <div className="modal__content">
        {__("Your template content will be empty, but it isn't saved yet.", 'yaymail')}
      </div>
    </AntModal>
  );
};

export default Modal;
