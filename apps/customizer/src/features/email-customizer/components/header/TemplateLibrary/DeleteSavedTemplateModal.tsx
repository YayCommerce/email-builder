import React from 'react';

import { Modal as AntModal } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import { useDeleteSavedTemplateMutation } from '@src/hooks/queries/useTemplateLibraryQueries';

import {
  parseSavedTemplatePublicId,
  TemplateLibrarySummary,
} from '@src/common/api/templateLibraryApi';
import useCustomNotificationStore from '@src/stores/notification';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';

interface DeleteSavedTemplateModalProps {
  template: TemplateLibrarySummary | null;
  emailType: string;
  isOpen: boolean;
  onClose: () => void;
  onDeleted?: (templateId: string) => void;
}

const DeleteSavedTemplateModal: React.FC<DeleteSavedTemplateModalProps> = ({
  template,
  emailType,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const notify = useCustomNotificationStore((state) => state.notify);
  const deleteMutation = useDeleteSavedTemplateMutation();

  const handleCancel = () => {
    if (deleteMutation.isLoading) {
      return;
    }
    onClose();
  };

  const handleConfirm = async () => {
    if (!template) {
      return;
    }

    const publicId = parseSavedTemplatePublicId(template.id);
    if (!publicId) {
      notify?.('error', __('Invalid template id.', 'yaymail'));
      return;
    }

    try {
      await deleteMutation.mutateAsync({
        publicId,
        email_type: emailType,
      });
      notify?.('success', __('Template deleted successfully.', 'yaymail'));
      onDeleted?.(template.id);
      onClose();
    } catch (error) {
      notify?.(
        'error',
        error instanceof Error ? error.message : __('Failed to delete template', 'yaymail'),
      );
    }
  };

  return (
    <AntModal
      title={
        <ModalHeader
          content={
            <h3 className={styles['modal_header_title']} style={{ fontSize: '16px' }}>
              {__('Delete template', 'yaymail')}
            </h3>
          }
        />
      }
      className="yaymail-global__modal yaymail-template-library__confirm-modal"
      open={isOpen}
      onCancel={handleCancel}
      centered
      width={480}
      footer={
        <ModalFooter
          onOk={handleConfirm}
          onCancel={handleCancel}
          okText={__('Yes, delete', 'yaymail')}
          isLoading={deleteMutation.isLoading}
        />
      }
      destroyOnClose
    >
      <p>
        {__(
          'Are you sure you want to delete template "%s"? This cannot be undone.',
          'yaymail',
        ).replace('%s', template?.name ?? '')}
      </p>
    </AntModal>
  );
};

export default DeleteSavedTemplateModal;
