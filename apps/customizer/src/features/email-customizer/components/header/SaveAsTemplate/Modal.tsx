import React, { useMemo, useState } from 'react';

import { Input, Modal as AntModal, Select } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import { useSaveAsTemplateMutation } from '@src/hooks/queries/useTemplateLibraryQueries';

import { SaveAsTemplateScope } from '@src/common/api/templateLibraryApi';
import { removeIconFromElements } from '@src/features/email-customizer/utils';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomNotificationStore from '@src/stores/notification';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';
import UpgradeNotice from '@src/components/upgrade/upgrade-notice';
import UpgradeButton from '@src/components/upgrade/upgrade-button';

interface SaveAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_TEMPLATE_NAME = __('Saved Template', 'yaymail');

const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState(DEFAULT_TEMPLATE_NAME);
  const [scope, setScope] = useState<SaveAsTemplateScope>('current');

  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const templateData = useCustomizerPageStore((state) => state.templateData);

  const notify = useCustomNotificationStore((state) => state.notify);
  const saveAsTemplateMutation = useSaveAsTemplateMutation();

  const scopeOptions = useMemo(
    () => [
      { value: 'current' as const, label: __('Current email', 'yaymail') },
      { value: 'all' as const, label: __('All emails', 'yaymail') },
    ],
    [],
  );

  const handleClose = () => {
    if (saveAsTemplateMutation.isLoading) {
      return;
    }
    setName(DEFAULT_TEMPLATE_NAME);
    onClose();
  };

  const handleSave = async () => {
    if (!currentTemplate) {
      notify?.('error', __('No template selected', 'yaymail'));
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      notify?.('error', __('Template name is required.', 'yaymail'));
      return;
    }

    try {
      const response = await saveAsTemplateMutation.mutateAsync({
        scope,
        name: trimmedName,
        email_type: currentTemplate,
        elements: removeIconFromElements(useTemplateContentStore.getState().list),
        email_settings: {
          background_color:
            templateData?.background_color ?? window.yaymailData.colors.default_background_color,
          text_link_color:
            templateData?.text_link_color ?? window.yaymailData.colors.default_text_link_color,
          content_background_color:
            templateData?.content_background_color ??
            window.yaymailData.colors.default_content_background_color,
          content_text_color:
            templateData?.content_text_color ??
            window.yaymailData.colors.default_content_text_color,
          title_color: templateData?.title_color ?? window.yaymailData.colors.default_title_color,
        },
        global_header_settings: templateData?.global_header_settings,
        global_footer_settings: templateData?.global_footer_settings,
      });

      notify?.('success', response.message ?? __('Open templates to see your new one.', 'yaymail'));
      setName(DEFAULT_TEMPLATE_NAME);
      onClose();
    } catch (error) {
      notify?.(
        'error',
        error instanceof Error ? error.message : __('Failed to save template', 'yaymail'),
      );
    }
  };

  return (
    <AntModal
      title={
        <ModalHeader
          content={
            <h4 className={styles['modal_header_title']}>{__('Save as template', 'yaymail')}</h4>
          }
        />
      }
      className="yaymail-global__modal yaymail-save-as-template__modal"
      open={isOpen}
      onCancel={handleClose}
      centered
      width={480}
      footer={
        <div>
          <p>{__('This feature is available in PRO version.', 'yaymail')}</p>
          <UpgradeButton />
        </div>
      }
    >
      <div className="modal__content yaymail-save-as-template__content">
        <p className="yaymail-save-as-template__description">
          {__(
            'Save the current email layout as a pre-built template for reuse in the template library.',
            'yaymail',
          )}
        </p>
        <label className="yaymail-save-as-template__label" htmlFor="yaymail-save-as-template-name">
          {__('Name', 'yaymail')}
        </label>
        <Input
          id="yaymail-save-as-template-name"
          className="yaymail-save-as-template__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled
        />
        <label className="yaymail-save-as-template__label" htmlFor="yaymail-save-as-template-scope">
          {__('Apply to', 'yaymail')}
        </label>
        <Select
          id="yaymail-save-as-template-scope"
          className="yaymail-global__select yaymail-save-as-template__select"
          value={scope}
          onChange={setScope}
          options={scopeOptions}
          disabled
        />
      </div>
    </AntModal>
  );
};

export default SaveAsTemplateModal;
