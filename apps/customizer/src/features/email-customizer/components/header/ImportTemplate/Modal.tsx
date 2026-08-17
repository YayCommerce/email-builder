/* eslint-disable no-restricted-imports */
import React, { useMemo, useState } from 'react';

import { Button, Modal as AntModal, Select, Tooltip } from 'antd';

import { ModalHeader } from '@src/components/modal-header-footer';

import useTemplateQueries from '@src/hooks/queries/useTemplateQueries';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import '../index.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';
import useCustomNotificationStore from '@src/stores/notification';

interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const HeaderContent = () => {
  return (
    <>
      <h4 className={styles['modal_header_title']}>
        {__('Import content from other template', 'yaymail')}
      </h4>
    </>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const templateList = useCustomizerPageStore((state) => state.templates);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);
  const notify = useCustomNotificationStore((state) => state.notify);

  const [selectedTemplate, setSelectedTemplate] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { copyTemplateMutation } = useTemplateQueries({
    template_name: currentTemplate,
    fetch: false,
  });

  const handleChange = (value: string) => {
    setSelectedTemplate(value);
  };

  const checkedLengthList = useMemo(
    () =>
      (templateList ?? []).map((template) => ({
        ...template,
        isTitleOversized: template.template_title.length > 55,
      })),
    [templateList],
  );

  const handleOk = async () => {
    setLoading(true);
    try {
      const response = await copyTemplateMutation.mutateAsync({
        template_id: templateData?.id || '',
        from_template: selectedTemplate || ''
      });
      if (response.success === true) {
        onClose();
      } else {
        throw new Error(response.message ?? __('Import template failed'));
      }
    } catch (error: any) {
      notify?.('error', error.message ?? __('Import template failed', 'yaymail'));
    } finally {
      unchooseElement();
      setLoading(false);
    }
  };

  return (
    <>
      <AntModal
        title={<ModalHeader content={<HeaderContent />} />}
        className="yaymail-global__modal yaymail-reset-template__modal"
        open={isOpen}
        onCancel={onClose}
        centered
        width={'500px'}
        footer={null}
        destroyOnClose
      >
        <div className="modal__content">
          <div style={{ marginBottom: 10 }}>
            {__(
              'All your current configurations for this template will be lost after you import data.',
              'yaymail',
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <h4 style={{ marginBottom: 5, fontWeight: 'normal' }}>
              {__('From template', 'yaymail')}
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Select
                style={{ width: '100%', marginRight: '10px' }}
                className="yaymail-global__select"
                value={selectedTemplate}
                placeholder="Select template"
                onChange={handleChange}
                popupMatchSelectWidth={false}
              >
                {checkedLengthList.map((template) => (
                  <Select.Option
                    key={template.name}
                    value={template.name}
                    disabled={currentTemplate === template.name}
                    className="option-template"
                  >
                    <Tooltip
                      placement="right"
                      title={template.isTitleOversized ? template.template_title : ''}
                      overlayInnerStyle={{ fontSize: '11px', width: 'max-content' }}
                    >
                      <span className="option-template__text">{template.template_title}</span>
                    </Tooltip>
                    <span
                      className="option-template__template-status"
                      data-status={template.status}
                    />
                  </Select.Option>
                ))}
              </Select>
              <Button
                key="ok"
                type="primary"
                loading={loading}
                onClick={handleOk}
                disabled={selectedTemplate === null}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
