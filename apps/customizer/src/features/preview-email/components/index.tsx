import { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Skeleton } from 'antd';

import OrderDataProvider from '@src/layouts/customizer/providers/OrderDataProvider';

import SelectOrder from '@src/features/email-customizer/components/header/SelectOrder';
import SelectTemplate from '@src/features/email-customizer/components/header/SelectTemplate';
import Modal from '@src/features/email-customizer/components/header/SendTestMail/Modal';

import useTemplatesListQueries from '@src/hooks/queries/useTemplatesListQueries';

import { ReactComponent as MailIcon } from '@src/assets/svgs/subject-mail-icon.svg';
import { previewEmailOfWoo } from '@src/common/ajax';
import { adjustIframeHeightToContent, buildIframePreviewHtml } from '@src/utils/iframe-preview';
import { getDefaultTemplateName } from '@src/utils';
import { __ } from '@wordpress/i18n';

import DeviceSwitcher from '../device-switcher';

import './index.scss';

export default function PreviewEmail() {
  const { isFetching } = useTemplatesListQueries(true);

  const [html, setHtml] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [emailTemplate, setEmailTemplate] = useState<string>(
    getDefaultTemplateName(),
  );
  const [searchOrderID, setSearchOrderID] = useState<string>('sample_order');
  const [isDisabledSendMail, setIsDisabledSendMail] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const handleChangePreviewDevice = (value: 'desktop' | 'mobile') => {
    if (value !== device) {
      setDevice(value);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await previewEmailOfWoo(emailTemplate, searchOrderID);
      if (response.success) {
        setHtml(response.data.html);
        setSubject(response.data.subject);
        setIsDisabledSendMail(response.data.is_disabled_send_mail);
      } else {
        setHtml(`<div>${__('No data to preview', 'yaymail')}</div>`);
        setSubject('');
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, [emailTemplate, searchOrderID]);

  const previewHtml = useMemo(
    () => buildIframePreviewHtml(html, device === 'mobile'),
    [html, device],
  );

  useEffect(() => {
    adjustIframeHeightToContent(iframeRef.current);
  }, [device, previewHtml]);

  return (
    <>
      <div className="yaymail-preview-email">
        <div className="yaymail-preview-email__content">
          <h3 className="yaymail-preview-email__title">{__('Preview Email', 'yaymail')}</h3>
          <div className="yaymail-preview-email__description">
            <p>
              {__(
                'Preview real order emails with multilingual support and send test emails to several inboxes at once.',
                'yaymail',
              )}
            </p>
          </div>
          <div className="yaymail-preview-email__preview yaymail-preview-template__modal">
            <div className="yaymail-preview-email-container">
              <div className="yaymail-preview-email__preview__header">
                <div className="yaymail-preview-email__preview__selectors">
                  <SelectTemplate
                    value={emailTemplate}
                    onChange={setEmailTemplate}
                    loading={isFetching}
                    disabled={isFetching}
                  />
                  <OrderDataProvider>
                    <SelectOrder
                      onChange={setSearchOrderID}
                      value={searchOrderID}
                      disabled={false}
                    />
                  </OrderDataProvider>
                </div>
                <div className="yaymail-preview-email__preview__actions">
                  <DeviceSwitcher onChange={handleChangePreviewDevice} currentDevice={device} />
                  <div className="yaymail-preview-email__preview__header__btn-send-test-email">
                    <Button onClick={handleOpenModal} type="primary" disabled={isDisabledSendMail}>
                      {__('Send test email', 'yaymail')}
                    </Button>
                    <Modal
                      isOpen={openModal}
                      onOpen={handleOpenModal}
                      onClose={handleCloseModal}
                      template={emailTemplate}
                      orderId={searchOrderID}
                      usingWooFunc
                    />
                  </div>
                </div>
              </div>
              <div
                className={`yaymail-preview-email__preview__content yaymail-template-content yaymail-preview-template-content yaymail-template-content__${device}`}
              >
                <div className="yaymail-preview-email__preview__content__subject">
                  {isLoading ? (
                    <Skeleton paragraph={{ rows: 1 }} title={false} active={isLoading} />
                  ) : (
                    <h2 style={{ marginTop: 0 }}>{subject}</h2>
                  )}
                  <div className="yaymail-preview-email__preview__content__subject__email-address">
                    <div className="yaymail-preview-email__preview__content__subject__email-address__icon">
                      <MailIcon />
                    </div>
                    <p
                      style={{ margin: 0, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
                    >
                      <span style={{ fontWeight: 'bold', marginRight: '3px' }}>
                        {window.yaymailData.site_title}
                      </span>
                      <span>{`<${window.yaymailData.test_email_address}>`}</span>
                    </p>
                  </div>
                </div>
                {isLoading || html === '' ? (
                  <div
                    style={{ width: '100%', height: '100%', overflow: 'auto', textAlign: 'center' }}
                    className="yaymail-preview-email__preview__content__body yaymail-preview-email__preview__content__body--loading"
                  >
                    <div
                      style={{ maxWidth: '650px', margin: 'auto' }}
                      className="yaymail-skeleton-divider"
                    >
                      <Skeleton
                        title={false}
                        round
                        paragraph={{ rows: 1, width: '30%' }}
                        style={{ marginBottom: 10 }}
                      />
                      <Skeleton
                        title={false}
                        round
                        paragraph={{ rows: 1, width: '100%' }}
                        className="yaymail-skeleton-divider__image"
                        style={{ marginBottom: 10 }}
                      />
                      <Skeleton title={false} round paragraph={{ rows: 1, width: '70%' }} />
                      <Skeleton title={false} round paragraph={{ rows: 1, width: '100%' }} />
                      <Skeleton title={false} round paragraph={{ rows: 1, width: '100%' }} />
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      overflow: 'auto',
                      textAlign: 'center',
                      overflowX: 'hidden',
                    }}
                    className="yaymail-preview-email__preview__content__body"
                  >
                    <iframe
                      ref={iframeRef}
                      className={`yaymail-preview-iframe yaymail-preview-iframe--${device}`}
                      srcDoc={previewHtml}
                      scrolling="no"
                      onLoad={() => adjustIframeHeightToContent(iframeRef.current)}
                      style={{
                        border: 'none',
                        width: device === 'mobile' ? 400 : '100%',
                        maxWidth: device === 'mobile' ? 400 : 960,
                        display: 'block',
                        margin: '0 auto',
                        background: '#fff',
                        borderRadius: 6,
                        boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.1)',
                      }}
                      title="Email preview"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
