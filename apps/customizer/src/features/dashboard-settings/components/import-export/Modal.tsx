import React, { useMemo, useState } from 'react';

import { Button, Modal as AntModal, Select, Tooltip } from 'antd';

import { ModalHeader } from '@src/components/modal-header-footer';

import useTemplatesListQueries from '@src/hooks/queries/useTemplatesListQueries';

import { exportTemplates } from '@src/common/ajax';
import { IElement } from '@src/features/email-customizer';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';
import JSZip from 'jszip';

import '../index.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';

interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface IExportData {
  file_name: string;
  templates_data: {
    template: string;
    elements: IElement[];
  };
}

const HeaderContent = () => {
  return (
    <>
      <h4 className={styles['modal_header_title']}>{__('Export templates', 'yaymail')}</h4>
    </>
  );
};

const Modal: React.FC<IModalProps> = ({ isOpen, onClose }) => {
  const templatesList = useCustomizerPageStore((state) => state.templates);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(['all']);
  const [loading, setLoading] = useState<boolean>(false);
  useTemplatesListQueries(true);

  const handleChange = (value: string[]) => {
    if (value.includes('all') && value.length > 1 && value[0] !== 'all') {
      setSelectedTemplates(['all']);
      return;
    }
    // If selecting individual templates, remove "all" from selection
    const newValue = value.filter((v) => v !== 'all');
    setSelectedTemplates(newValue);
  };

  const checkedLengthList = useMemo(
    () =>
      (templatesList ?? []).map((template) => ({
        ...template,
        isTitleOversized: template.template_title.length > 55,
      })),
    [templatesList],
  );

  const handleOk = async () => {
    setLoading(true);
    const maybeExportTemplates = selectedTemplates.includes('all')
      ? templatesList?.map((template) => template.name)
      : selectedTemplates;
    const response = await exportTemplates(maybeExportTemplates);
    if (response.success) {
      if (response.data.data.length > 0) {
        var zip = new JSZip();
        response.data.data.forEach((export_data: IExportData) => {
          var file_content = JSON.stringify(export_data['templates_data']);
          zip.file(export_data['file_name'], file_content);
        });
        zip
          .generateAsync({
            type: 'base64',
          })
          .then(function (content: string) {
            let link = document.createElement('a');
            link.href = 'data:application/zip;base64,' + content;
            link.setAttribute('download', response.data.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
          });
      }
      setLoading(false);
    } else {
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
            {__('Choose templates you want to export.', 'yaymail')}
          </div>
          <div style={{ marginTop: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Select
                mode="multiple"
                style={{ width: '100%', marginRight: '10px' }}
                className="yaymail-global__select"
                value={selectedTemplates}
                placeholder={__('Select templates', 'yaymail')}
                onChange={handleChange}
                popupMatchSelectWidth={false}
              >
                <Select.Option key="all" value="all" className="option-template">
                  <span className="option-template__text">{__('All templates', 'yaymail')}</span>
                </Select.Option>
                {checkedLengthList.map((template) => (
                  <Select.Option
                    key={template.name}
                    value={template.name}
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
                disabled={selectedTemplates.length === 0}
              >
                {__('Export', 'yaymail')}
              </Button>
            </div>
          </div>
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
