import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useQueryClient } from 'react-query';

import { Button, Form, Space } from 'antd';

import { exportState, importState } from '@src/common/ajax';
import { getBrandName, isWpPlatform } from '@src/common/platform';
import useCustomNotificationStore from '@src/stores/notification';
import { __, sprintf } from '@wordpress/i18n';
import JSZip from 'jszip';

const Backup = () => {
  const brandName = getBrandName();
  const notify = useCustomNotificationStore((state) => state.notify);
  const queryClient = useQueryClient();
  const ref = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const handleChangeImportFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files !== null && e.currentTarget.files.length > 0) {
      setUploadedFile(e.currentTarget.files[0]);
    }
  };

  const handleImportFile = async () => {
    try {
      setIsImporting(true);
      if (uploadedFile === null) {
        throw new Error(__('No file chosen.', 'yaymail'));
      }
      const response = await importState(uploadedFile);
      if (!response.success) {
        throw new Error(response.data.message || __('Import failed!', 'yaymail'));
      }
      setUploadedFile(null);
      notify?.('success', __('State imported successfully!', 'yaymail'));
      queryClient.invalidateQueries();
    } catch (error: any) {
      console.error(error);
      notify?.('error', __('Import failed!', 'yaymail'));
    } finally {
      setIsImporting(false);
    }
  };

  const [isExporting, setIsExporting] = useState<boolean>(false);

  const onExport = useCallback(async () => {
    try {
      setIsExporting(true);
      const response = await exportState();
      if (!response.success) {
        throw new Error(response.data.message || __('Export failed!', 'yaymail'));
      }
      const data = response.data.data;
      var zip = new JSZip();
      zip.file(isWpPlatform() ? 'email_builder_backup.json' : 'yaymail_backup.json', JSON.stringify(data));
      zip
        .generateAsync({
          type: 'base64',
        })
        .then(function (content: string) {
          let link = document.createElement('a');
          link.href = 'data:application/zip;base64,' + content;
          link.setAttribute('download', `${response.data.file_name}.zip`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    } catch (e) {
      console.error(e);
      notify?.('error', __('Export failed!', 'yaymail'));
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <>
      <h3 className="yaymail-settings__title">{__('Backups', 'yaymail')}</h3>
      <p className="yaymail-settings__description">
        {sprintf(
          /* translators: %s: brand name, e.g. YayMail or Email Builder */
          __(
            "Back up and restore your %s data, ensuring compatibility whether you're upgrading to the latest release or reverting to a previous version.",
          ),
          brandName,
        )}
      </p>
      <div className="yaymail-settings__content">
        <div className="yaymail-settings-option-wrapper">
          <div className="yaymail-settings-label">
            <div className="yaymail-settings-label__primary">{__('Create Backup', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              {sprintf(
                /* translators: %s: brand name, e.g. YayMail or Email Builder */
                __('Create a backup of your %s data.', 'yaymail'),
                brandName,
              )}
            </div>
          </div>
          <div className="yaymail-settings-label secondary_column">
            <div className="yaymail-settings-label__primary">{__('Create', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              <Space direction="vertical" size={1}>
                <Button onClick={onExport} type="primary" loading={isExporting}>
                  {__('Create', 'yaymail')}
                </Button>
              </Space>
            </div>
          </div>
        </div>
        <div className="yaymail-settings-option-wrapper">
          <span className="yaymail-settings-label">
            <div className="yaymail-settings-label__primary">{__('Backup data', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              {sprintf(
                /* translators: %s: brand name, e.g. YayMail or Email Builder */
                __('Restore your %s data from a backup.', 'yaymail'),
                brandName,
              )}
            </div>
          </span>
          <div className="yaymail-settings-label secondary_column">
            <div className="yaymail-settings-label__primary">{__('Restore', 'yaymail')}</div>
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
                          multiple={false}
                          onChange={handleChangeImportFile}
                          accept="application/zip"
                          style={{ display: 'none' }}
                        />
                        <Button onClick={() => ref.current?.click()}>
                          {__('Choose File', 'yaymail')}
                        </Button>
                      </Form.Item>
                      <Form.Item style={{ margin: 0 }}>
                        <div className="yaymail-settings-import-button-wrapper">
                          <Button
                            loading={isImporting}
                            htmlType="submit"
                            disabled={uploadedFile === null}
                            type="primary"
                          >
                            {__('Restore', 'yaymail')}
                          </Button>
                        </div>
                      </Form.Item>
                    </Form>
                  </div>
                  <span className="yaymail-settings-import-file-name">
                    {uploadedFile !== null ? uploadedFile.name : __('No file chosen.', 'yaymail')}
                  </span>
                </Space>
              </Space>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Backup;
