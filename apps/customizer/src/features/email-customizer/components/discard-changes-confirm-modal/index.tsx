import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Modal } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import useSaveTemplate from '@src/hooks/useSaveTemplate';

import useTemplateContentStore from '@src/stores/templateContent';
import useTemplateContentHistoryStore from '@src/stores/templateContentHistory';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';

const HeaderContent = () => {
  return <h4 className={styles['modal_header_title']}>{__('Save template?', 'yaymail')}</h4>;
};

const DiscardChangesConfirmModal = () => {
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);
  const reset = useTemplateContentHistoryStore((state) => state.reset);
  const isOpen = useTemplateContentStore((state) => state.isDiscardChangesConfirmModalDisplayed);
  const hideDiscardChangesConfirmModal = useTemplateContentStore(
    (state) => state.hideDiscardChangesConfirmModal,
  );

  const onClose = useCallback(() => {
    hideDiscardChangesConfirmModal();
  }, []);

  const { saveFunction } = useSaveTemplate();
  const onOkCallback = useRef<CustomEvent['detail']>(() => {});

  const navigate = useNavigate();
  const navigatingPath = useTemplateContentStore((state) => state.navigatingPath);

  const handleCancel = useCallback(async () => {
    onClose();
    await new Promise<void>((resolve) => {
      changeContentStatus(false);
      resolve();
    });
    onOkCallback.current();
    if (navigatingPath) {
      reset();
      navigate(navigatingPath);
    }
  }, [onClose, navigatingPath, changeContentStatus, reset, navigate]);

  const handleOk = useCallback(() => {
    onClose();
    saveFunction();
    onOkCallback.current();
    if (navigatingPath) {
      reset();
      navigate(navigatingPath);
    }
  }, [saveFunction, onClose, navigatingPath, reset, navigate]);

  return (
    <Modal
      title={<ModalHeader content={<HeaderContent />} />}
      className="yaymail-global__modal yaymail-blank-template__modal"
      open={isOpen}
      onCancel={onClose}
      centered
      width={'500px'}
      footer={
        <ModalFooter
          onOk={handleOk}
          onCancel={handleCancel}
          okText={__('Save', 'yaymail')}
          cancelText={__("No, don't save")}
        />
      }
      destroyOnClose
    >
      {__('Do you want to save before moving to another template?', 'yaymail')}
    </Modal>
  );
};

export default DiscardChangesConfirmModal;
