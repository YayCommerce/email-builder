import { ChangeEvent, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';

import { Button, Form, notification, Space } from 'antd';
import type { IconType } from 'antd/es/notification/interface';

import { importTemplates } from '@src/common/ajax';
import { getBrandName } from '@src/common/platform';
import { __, sprintf } from '@wordpress/i18n';

import Modal from './Modal';

type NotificationType = IconType;

export default function ImportExport() {
  const brandName = getBrandName();
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [importFiles, setImportFiles] = useState<FileList | null>(null);

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files !== null) {
      setImportFiles(e.currentTarget.files);
    }
  };

  const handleImportFile = async () => {
    setLoading(true);
    if (importFiles !== null) {
      const response = await importTemplates(importFiles);
      if (response.success) {
        setImportFiles(null);
        if (response.data?.imported_data?.length > 0) {
          showNotifications('success', `${response.data.imported_data.length} templates imported`);
          response.data.imported_data.forEach(({ template_name }: any) => {
            queryClient.invalidateQueries({ queryKey: ['template', template_name] });
          });
        } else {
          showNotifications('success', 'No template imported');
        }
      } else {
        showNotifications('error', response.data.message);
      }
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="yaymail-settings__title">{__('Import/Export', 'yaymail')}</h3>
      <p className="yaymail-settings__description">
        {sprintf(
          /* translators: %s: brand name, e.g. YayMail or Email Builder */
          __(
            'Easily manage %s templates by importing from compatible formats or exporting for backup or sharing.',
            'yaymail',
          ),
          brandName,
        )}
      </p>
      <div className="yaymail-settings__content">
        <div className="yaymail-settings-option-wrapper">
          <div className="yaymail-settings-label">
            <div className="yaymail-settings-label__primary">{__('Export', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              {sprintf(
                /* translators: %s: brand name, e.g. YayMail or Email Builder */
                __('Allows you to securely download all created %s templates in a convenient file format'),
                brandName,
              )}
            </div>
          </div>
          <div className="yaymail-settings-label secondary_column">
            <div className="yaymail-settings-label__primary">{__('Export', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              <Button onClick={handleOpenModal} type="primary">
                {__('Export Templates', 'yaymail')}
              </Button>
            </div>
          </div>
        </div>
        <div className="yaymail-settings-option-wrapper">
          <span className="yaymail-settings-label">
            <div className="yaymail-settings-label__primary">
              {__('Import Templates', 'yaymail')}
            </div>
            <div className="yaymail-settings-label__secondary">
              {sprintf(
                /* translators: %s: brand name, e.g. YayMail or Email Builder */
                __('Empowers you to seamlessly upload single or multiple %s templates', 'yaymail'),
                brandName,
              )}
            </div>
          </span>
          <div className="yaymail-settings-label secondary_column">
            <div className="yaymail-settings-label__primary">
              {__('Import Templates', 'yaymail')}
            </div>
            <div className="yaymail-settings-label__secondary">
              <Space align="start" size="middle">
                <Space direction="vertical">
                  <div>
                    <Form
                      layout="inline"
                      method="post"
                      encType="multipart/form-data"
                      onFinish={handleImportFile}
                      style={{ gap: 16 }}
                    >
                      <Form.Item style={{ margin: 0 }}>
                        <input
                          id="choose_file"
                          ref={ref}
                          type="file"
                          multiple={true}
                          onChange={handleChangeImportFile}
                          accept="application/json"
                          style={{ display: 'none' }}
                        />
                        <Button onClick={() => ref.current?.click()}>
                          {__('Choose File', 'yaymail')}
                        </Button>
                      </Form.Item>
                      <Form.Item style={{ margin: 0 }}>
                        <div className="yaymail-settings-import-button-wrapper">
                          <Button
                            loading={loading}
                            htmlType="submit"
                            disabled={importFiles === null}
                            type="primary"
                          >
                            {__('Import', 'yaymail')}
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>
                  </div>
                  <span className="yaymail-settings-import-file-name">
                    {importFiles !== null
                      ? Array.from(importFiles).map((file) => {
                          return (
                            <span key={file.name}>
                              <span> {file.name} </span>
                              <br />
                            </span>
                          );
                        })
                      : __('No file chosen.', 'yaymail')}
                  </span>
                </Space>
              </Space>
            </div>
          </div>
        </div>
        {notificationsContextHolder}
        <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
      </div>
    </>
  );
}
