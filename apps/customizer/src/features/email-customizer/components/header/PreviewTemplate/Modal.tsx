import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Modal as AntModal, Spin } from 'antd';

import { ModalHeader } from '@src/components/modal-header-footer';
import EmptyPreviewContent from '@src/features/email-customizer/components/header/PreviewTemplate/EmptyPreviewContent';

import { ReactComponent as MailIcon } from '@src/assets/svgs/subject-mail-icon.svg';
import DeviceSwitcher from '@src/features/preview-email/device-switcher';
import { adjustIframeHeightToContent, buildIframePreviewHtml } from '@src/utils/iframe-preview';
import { __ } from '@wordpress/i18n';

import './Modal.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';

interface IModalProps {
  isOpen: boolean;
  isLoading: boolean;
  data: {
    html: string;
    subject: string;
  } | null;
  onClose: () => void;
}

type DeviceType = 'desktop' | 'mobile';

const HeaderContent: React.FC<{
  device: DeviceType;
  onChangeDevice: React.ComponentProps<typeof DeviceSwitcher>['onChange'];
}> = ({ device, onChangeDevice }) => (
  <>
    <h4 className={styles['modal_header_title']}>{__('Email preview', 'yaymail')}</h4>
    <div className={styles['modal-header-right']}>
      <DeviceSwitcher onChange={onChangeDevice} currentDevice={device} />
    </div>
  </>
);

const Modal: React.FC<IModalProps> = ({ isOpen, onClose, data, isLoading }) => {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleCloseModal = () => onClose();
  const handleChangeDevice = (value: DeviceType) => setDevice(value);

  const previewHtml = useMemo(
    () => buildIframePreviewHtml(data?.html ?? '', device === 'mobile'),
    [data?.html, device],
  );

  useEffect(() => {
    adjustIframeHeightToContent(iframeRef.current);
  }, [device, previewHtml]);

  const content = data?.html ? (
    <div
      className={`yaymail-preview-email__preview__content yaymail-preview-template-content yaymail-template-content__${device}`}
    >
      <div className="yaymail-preview-email__preview__content__subject">
        <h2 style={{ marginTop: 0 }}>{data?.subject ?? __('No subject', 'yaymail')}</h2>
        <div className="yaymail-preview-email__preview__content__subject__email-address">
          <div className="yaymail-preview-email__preview__content__subject__email-address__icon">
            <MailIcon />
          </div>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 'bold', marginRight: '3px' }}>
              {window.yaymailData.site_title}
            </span>
            <span>{`<${window.yaymailData.test_email_address}>`}</span>
          </p>
        </div>
      </div>
      <div className={`modal__content modal__content--${device}`} style={{ overflow: 'auto' }}>
        <iframe
          ref={iframeRef}
          className={`yaymail-preview-iframe yaymail-preview-iframe--${device}`}
          srcDoc={previewHtml}
          scrolling="no"
          onLoad={() => adjustIframeHeightToContent(iframeRef.current)}
          style={{
            border: 'none',
            width: '100%',
          }}
          title="Email preview"
        />
      </div>
    </div>
  ) : (
    <EmptyPreviewContent />
  );

  return (
    <AntModal
      title={
        <ModalHeader
          content={<HeaderContent device={device} onChangeDevice={handleChangeDevice} />}
        />
      }
      className="yaymail-global__modal yaymail-preview-template__modal"
      open={isOpen}
      onCancel={handleCloseModal}
      centered
      width={'70%'}
      footer={null}
      destroyOnClose
    >
      {isLoading ? <Spin className="yaymail-loading-preview-template" /> : content}
    </AntModal>
  );
};

export default Modal;
