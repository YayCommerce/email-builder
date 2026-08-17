import React from 'react';

import { Modal as AntModal, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import useRevisionQueries from '@src/hooks/queries/useRevisionQueries';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { getDefaultTemplateName } from '@src/utils';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';

type NotificationType = IconType;

interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HeaderContent = () => {
  return (
    <>
      <h4 className={styles['modal_header_title']}>
        {__('Are you sure you want to clear all revisions?', 'yaymail')}
      </h4>
    </>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const selectedTemplate = useCustomizerPageStore((state) => state.currentTemplate);

  const { isPageLoading } = useCustomizerPageStore((state) => state);
  const { clearRevisionMutation } = useRevisionQueries({
    template_name: selectedTemplate,
    fetch: false,
  });

  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const handleClearRevisions = async () => {
    const response = await clearRevisionMutation.mutateAsync(
      selectedTemplate ?? getDefaultTemplateName(),
    );
    if (response.data.success) {
      showNotifications('success', 'Revision cleared successfully');
    } else {
      showNotifications('error', 'Revision clear failed');
    }
    onClose();
  };

  return (
    <>
      {notificationsContextHolder}
      <AntModal
        title={<ModalHeader content={<HeaderContent />} />}
        className="yaymail-global__modal yaymail-clear-revisions__modal"
        open={isOpen}
        onCancel={onClose}
        centered
        width={'500px'}
        footer={
          <ModalFooter
            onOk={handleClearRevisions}
            onCancel={onClose}
            okText={__('Clear all revisions', 'yaymail')}
            isLoading={isPageLoading}
          />
        }
        destroyOnClose
      >
        <div className="modal__content">{__('All revisions will be deleted.', 'yaymail')}</div>
      </AntModal>
    </>
  );
};

export default Modal;
