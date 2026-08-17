import React, { useCallback, useState } from 'react';

import { Modal as AntModal, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import useTemplateQueries from '@src/hooks/queries/useTemplateQueries';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
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
        {__('Are you sure you want to reset this template?', 'yaymail')}
      </h4>
    </>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const selectedTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);

  const [isReseting, setIsReseting] = useState(false);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const { resetTemplateMutation } = useTemplateQueries({
    template_name: selectedTemplate,
    fetch: false,
  });

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };
  const setGlobalHeaderFooter = useCustomizerPageStore((state) => state.setGlobalHeaderFooter);

  const handleResetTemplate = useCallback(async () => {
    try {
      setIsReseting(true);
      const response = await resetTemplateMutation.mutateAsync([templateData?.id || '']);
      if (response.success === true) {
        showNotifications('success', __('Template reset successfully.', 'yaymail'));
        //Reset global header and footer
        if (response.list_template_data.length !== 0) {
          const templateData = response.list_template_data[0];
          const defaultElements = templateData.elements;
          if (defaultElements.length !== 0) {
            const dividerIndex = defaultElements.findIndex(
              (element: any) => element.type === 'skeleton_divider',
            );
            if (dividerIndex < 0) return;
            const globalHeaderElements = defaultElements.slice(0, dividerIndex);
            const globalFooterElements = defaultElements.slice(dividerIndex + 1);
            setGlobalHeaderFooter({ globalHeaderElements, globalFooterElements });
          }
        }
      } else {
        showNotifications('error', __('Reset failed', 'yaymail'));
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      unchooseElement();
      setIsReseting(false);
      onClose();
    }
  }, [templateData, isReseting, setIsReseting]);

  return (
    <>
      {notificationsContextHolder}
      <AntModal
        title={<ModalHeader content={<HeaderContent />} />}
        className="yaymail-global__modal yaymail-reset-template__modal"
        open={isOpen}
        onCancel={onClose}
        centered
        width={'500px'}
        footer={
          <ModalFooter
            onOk={handleResetTemplate}
            onCancel={onClose}
            okText={__('Reset', 'yaymail')}
            isLoading={isReseting}
          />
        }
        destroyOnClose
      >
        <div className="modal__content">
          {__("All changes you made won't be saved.", 'yaymail')}
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
