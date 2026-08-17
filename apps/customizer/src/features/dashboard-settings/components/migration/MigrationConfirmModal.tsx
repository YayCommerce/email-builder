import { Modal } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';

type PropsType = {
  isOpen: boolean;
  onClose: () => void;
  headerText: string;
  onOk: () => void;
  okText?: string;
};

const MigrationConfirmModal = (props: PropsType) => {
  const { isOpen, onClose, onOk, headerText, okText } = props;
  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onOk();
    onClose();
  };

  return (
    <Modal
      title={
        <ModalHeader content={<h4 className={styles['modal_header_title']}>{headerText}</h4>} />
      }
      className="yaymail-global__modal yaymail-remove-element__modal"
      open={isOpen}
      onCancel={onClose}
      centered
      width={'500px'}
      footer={
        <ModalFooter
          onOk={handleOk}
          onCancel={handleCancel}
          okText={okText ?? __('Yes, sure!', 'yaymail')}
        />
      }
      destroyOnClose
    />
  );
};

export default MigrationConfirmModal;
