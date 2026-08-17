/* eslint-disable no-restricted-imports */
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Input, Modal as AntModal, notification } from 'antd';
import type { IconType } from 'antd/es/notification/interface';

import { OrderDataContext } from '@src/layouts/customizer/providers/OrderDataProvider';

import { ModalHeader } from '@src/components/modal-header-footer';

import { ReactComponent as MailSuccess } from '@src/assets/svgs/send-mail-success.svg';
import { ReactComponent as YaySMTPLogo } from '@src/assets/svgs/yaysmtp-logo.svg';
import { installYaySMTP, previewEmailOfWoo, reviewYayMail, sendTestMail } from '@src/common/ajax';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import './index.scss';
import styles from '@src/components/modal-header-footer/styles.module.scss';

type NotificationType = IconType;

interface IModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  template?: string;
  orderId?: string;
  usingWooFunc?: boolean;
}

const HeaderContent = () => {
  return (
    <>
      <h4 className={styles['modal_header_title']}>{__('Send Email', 'yaymail')}</h4>
    </>
  );
};

const SendMailContent = ({
  usingWooFunc,
  template,
  orderId,
}: {
  usingWooFunc?: boolean;
  template?: string;
  orderId?: string;
}) => {
  const [email, setEmail] = useState<string>(window.yaymailData.test_email_address);
  const [sendEmailSuccess, setSendEmailSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const templateName = useCustomizerPageStore((state) => state.templateData?.name);
  const { selectedOrderID } = useContext(OrderDataContext);

  const isReviewed = useCustomizerPageStore((state) => state.isReviewed);
  const setIsReviewed = useCustomizerPageStore((state) => state.setIsReviewed);

  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const handleReviewYayMail = async () => {
    try {
      setIsReviewed(true);
      await reviewYayMail();
    } catch (error) {
      console.error(error);
    }
  };

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const handleSendTestMail = async () => {
    try {
      setLoading(true);
      setSendEmailSuccess(false);
      const response = usingWooFunc
        ? await previewEmailOfWoo(template ?? templateName, orderId ?? selectedOrderID, email)
        : await sendTestMail(template ?? templateName, orderId ?? selectedOrderID, email);
      if (response.success) {
        setLoading(false);
        setSendEmailSuccess(true);
        showNotifications('success', 'Send mail success');
      } else {
        setLoading(false);
        showNotifications('error', 'Send mail failed');
      }
    } catch (error) {
      setLoading(false);
      showNotifications('error', 'Send mail failed');
      console.error(error);
    }
  };
  return (
    <>
      {notificationsContextHolder}
      <div className="yaymail-send-email">
        <h4>{__('Email address for testing', 'yaymail')}</h4>
        <div className="yaymail-send-email__content">
          <Input
            type="email"
            className="yaymail-send-email__content__text"
            placeholder="Ex: help.yaycommerce@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            allowClear
          />
          <Button
            className="yaymail-send-email__content__btn-send"
            key="ok"
            type="primary"
            loading={loading}
            onClick={handleSendTestMail}
          >
            Send Email
          </Button>
        </div>
        {sendEmailSuccess && (
          <>
            <p className="yaymail-send-email__success">
              <i className="yaymail-send-email__success__icon">
                <MailSuccess />
              </i>
              <span>
                <span>Yay! Email sent successfully.&nbsp;</span>
                <a
                  target="_blank"
                  href="https://mail.google.com/"
                  className="yaymail-link-gmail"
                  rel="noreferrer"
                >
                  Open mailbox
                </a>
              </span>
            </p>
            {!window.yaymailData.reviewed &&
              (isReviewed ? (
                <p className="yaymail-send-email__success">
                  <span className="yaymail-footer-review-text">
                    {__('Thank you for using YayMail.', 'yaymail')}
                  </span>
                </p>
              ) : (
                <p className="yaymail-send-email__success">
                  <span className="yaymail-footer-review-text">
                    {__(
                      'Are you happy with YayMail? You can give a review to motivate our developers',
                      'yaymail',
                    )}
                    <svg
                      style={{
                        transform: 'translateY(2px)',
                      }}
                      width="15"
                      height="15"
                      viewBox="0 0 80 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40.0001 70.4762C56.8316 70.4762 70.4763 56.8315 70.4763 40C70.4763 23.1685 56.8316 9.5238 40.0001 9.5238C23.1686 9.5238 9.52393 23.1685 9.52393 40C9.52393 56.8315 23.1686 70.4762 40.0001 70.4762Z"
                        fill="url(#paint0_radial)"
                      />
                      <path
                        opacity="0.5"
                        d="M40.0001 70.4762C56.8316 70.4762 70.4763 56.8315 70.4763 40C70.4763 23.1685 56.8316 9.5238 40.0001 9.5238C23.1686 9.5238 9.52393 23.1685 9.52393 40C9.52393 56.8315 23.1686 70.4762 40.0001 70.4762Z"
                        fill="url(#paint1_radial)"
                      />
                      <path
                        opacity="0.5"
                        d="M40.0001 70.4762C56.8316 70.4762 70.4763 56.8315 70.4763 40C70.4763 23.1685 56.8316 9.5238 40.0001 9.5238C23.1686 9.5238 9.52393 23.1685 9.52393 40C9.52393 56.8315 23.1686 70.4762 40.0001 70.4762Z"
                        fill="url(#paint2_radial)"
                      />
                      <path
                        opacity="0.5"
                        d="M40.0001 70.4762C56.8316 70.4762 70.4763 56.8315 70.4763 40C70.4763 23.1685 56.8316 9.5238 40.0001 9.5238C23.1686 9.5238 9.52393 23.1685 9.52393 40C9.52393 56.8315 23.1686 70.4762 40.0001 70.4762Z"
                        fill="url(#paint3_radial)"
                      />
                      <path
                        d="M40 60.2665C31.219 60.2665 28.419 50.857 31.0857 52.3237C34.6667 54.3046 36.9524 54.4951 40 54.4951C43.0476 54.4951 45.3143 54.3046 48.9143 52.3237C51.5809 50.857 48.7809 60.2665 40 60.2665Z"
                        fill="#643800"
                      />
                      <path
                        d="M48.9144 52.3238C45.3335 54.3048 43.0478 54.4952 40.0001 54.4952C36.9525 54.4952 34.6859 54.3048 31.0859 52.3238C30.1525 51.8095 29.8859 52.6095 30.3049 53.8857C30.3049 53.8667 30.4382 52.4952 31.6954 53.4476C31.6954 53.4476 36.324 56.2286 39.9811 56.2286C43.6382 56.2286 48.2668 53.4476 48.2668 53.4476C49.5239 52.5143 49.6573 53.8667 49.6573 53.8857C50.1144 52.6095 49.8478 51.8095 48.9144 52.3238Z"
                        fill="url(#paint4_linear)"
                      />
                      <path
                        d="M33.3525 28.8761C33.5239 27.6571 32.3049 26.7238 30.0573 26.4381C28.1335 26.1714 23.8097 26.6666 20.4001 30C19.7716 30.6095 20.5525 31.1047 21.124 30.7238C23.1049 29.4476 28.1335 28.1523 31.7906 29.0476C33.2763 29.4285 33.3525 28.8761 33.3525 28.8761Z"
                        fill="url(#paint5_linear)"
                      />
                      <path
                        d="M46.6478 28.8761C46.4763 27.657 47.6954 26.7237 49.943 26.438C51.8668 26.1903 56.1906 26.6665 59.6002 29.9999C60.2287 30.6094 59.4478 31.1046 58.8764 30.7237C56.8954 29.4475 51.8668 28.1523 48.2097 29.0475C46.724 29.4284 46.6478 28.8761 46.6478 28.8761Z"
                        fill="url(#paint6_linear)"
                      />
                      <path
                        d="M52.6287 36.3045C52.6287 36.3045 57.6572 37.1807 58.7811 41.1045C58.8572 41.3522 58.8763 41.6188 58.8572 41.8664C58.8191 42.3807 58.3049 42.876 57.4477 42.3236C52.1144 38.876 48.8192 40.076 46.362 40.9141C45.4096 41.2379 44.6477 40.2283 44.9906 39.4283C45.0858 39.1998 45.162 38.9522 45.3144 38.7426C47.6001 35.4093 52.6287 36.3045 52.6287 36.3045Z"
                        fill="url(#paint7_radial)"
                      />
                      <path
                        d="M52.4193 37.5046C52.4193 37.5046 56.5145 38.2094 58.8383 41.5618C58.8193 41.4094 58.8002 41.257 58.7621 41.1046C57.6383 37.1808 52.6097 36.3046 52.6097 36.3046C52.6097 36.3046 47.6002 35.4094 45.2764 38.7237C45.1812 38.857 45.124 38.9903 45.0669 39.1237C48.3431 36.7618 52.4193 37.5046 52.4193 37.5046Z"
                        fill="url(#paint8_linear)"
                      />
                      <path
                        d="M27.3714 36.3045C27.3714 36.3045 22.3429 37.1807 21.219 41.1045C21.1429 41.3522 21.1238 41.6188 21.1429 41.8664C21.181 42.3807 21.6952 42.876 22.5524 42.3236C27.8857 38.876 31.1809 40.076 33.6381 40.9141C34.5905 41.2379 35.3524 40.2283 35.0095 39.4283C34.9143 39.1998 34.8381 38.9522 34.6857 38.7426C32.4 35.4093 27.3714 36.3045 27.3714 36.3045Z"
                        fill="url(#paint9_radial)"
                      />
                      <path
                        d="M27.5809 37.5046C27.5809 37.5046 23.4857 38.2094 21.1619 41.5618C21.1809 41.4094 21.2 41.257 21.2381 41.1046C22.3619 37.1808 27.3904 36.3046 27.3904 36.3046C27.3904 36.3046 32.4 35.4094 34.7238 38.7237C34.819 38.857 34.8762 38.9903 34.9333 39.1237C31.6571 36.7618 27.5809 37.5046 27.5809 37.5046Z"
                        fill="url(#paint10_linear)"
                      />
                      <defs>
                        <radialGradient
                          id="paint0_radial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(34.0039 27.649) scale(36.7656)"
                        >
                          <stop stopColor="#FFE030" />
                          <stop offset="1" stopColor="#FFB92E" />
                        </radialGradient>
                        <radialGradient
                          id="paint1_radial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(34.0039 27.649) scale(28.9251)"
                        >
                          <stop stopColor="#FFEA5F" />
                          <stop offset="1" stopColor="#FFBC47" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient
                          id="paint2_radial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(23.3965 47.5816) rotate(-2.7703) scale(12.819 10.143)"
                        >
                          <stop stopColor="#FF4C00" />
                          <stop offset="0.1542" stopColor="#FF4C00" />
                          <stop offset="0.1795" stopColor="#FF4C00" />
                          <stop offset="0.3996" stopColor="#FB4C0B" stopOpacity="0.7318" />
                          <stop offset="0.7799" stopColor="#EF4B27" stopOpacity="0.2683" />
                          <stop offset="1" stopColor="#E74A3A" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient
                          id="paint3_radial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(56.5951 47.5816) rotate(-177.23) scale(12.819 10.143)"
                        >
                          <stop stopColor="#FF4C00" />
                          <stop offset="0.1542" stopColor="#FF4C00" />
                          <stop offset="0.1795" stopColor="#FF4C00" />
                          <stop offset="0.3996" stopColor="#FB4C0B" stopOpacity="0.7318" />
                          <stop offset="0.7799" stopColor="#EF4B27" stopOpacity="0.2683" />
                          <stop offset="1" stopColor="#E74A3A" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient
                          id="paint4_linear"
                          x1="39.9997"
                          y1="48.8487"
                          x2="39.9997"
                          y2="56.0166"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.00132565" stopColor="#3C2200" />
                          <stop offset="1" stopColor="#512D00" />
                        </linearGradient>
                        <linearGradient
                          id="paint5_linear"
                          x1="26.7086"
                          y1="30.0508"
                          x2="27.1357"
                          y2="26.868"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.00132565" stopColor="#3C2200" />
                          <stop offset="1" stopColor="#7A4400" />
                        </linearGradient>
                        <linearGradient
                          id="paint6_linear"
                          x1="53.2907"
                          y1="30.0509"
                          x2="52.8636"
                          y2="26.8681"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.00132565" stopColor="#3C2200" />
                          <stop offset="1" stopColor="#7A4400" />
                        </linearGradient>
                        <radialGradient
                          id="paint7_radial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(52.1362 39.13) rotate(9.98082) scale(5.47711 2.64266)"
                        >
                          <stop offset="0.00132565" stopColor="#7A4400" />
                          <stop offset="1" stopColor="#643800" />
                        </radialGradient>
                        <linearGradient
                          id="paint8_linear"
                          x1="52.9287"
                          y1="34.7224"
                          x2="52.3353"
                          y2="38.2109"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.00132565" stopColor="#3C2200" />
                          <stop offset="1" stopColor="#512D00" />
                        </linearGradient>
                        <radialGradient
                          id="paint9_radial"
                          cx="0"
                          cy="0"
                          r="1"
                          gradientUnits="userSpaceOnUse"
                          gradientTransform="translate(27.9428 39.0431) rotate(170.019) scale(5.47711 2.64266)"
                        >
                          <stop offset="0.00132565" stopColor="#7A4400" />
                          <stop offset="1" stopColor="#643800" />
                        </radialGradient>
                        <linearGradient
                          id="paint10_linear"
                          x1="27.0206"
                          y1="34.6925"
                          x2="27.614"
                          y2="38.1811"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.00132565" stopColor="#3C2200" />
                          <stop offset="1" stopColor="#512D00" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <Link
                      target="_blank"
                      to="https://wordpress.org/support/plugin/yaymail/reviews/"
                      onClick={handleReviewYayMail}
                      style={{
                        marginLeft: '5px',
                        verticalAlign: 'bottom',
                        textDecoration: 'underline',
                      }}
                    >
                      {__('Rate now', 'yaymail')}
                    </Link>
                  </span>
                </p>
              ))}
          </>
        )}
      </div>
    </>
  );
};

const SuccessNotifications = () => {
  return (
    <>
      <div>
        <span>YaySMTP installed successfully.</span>
        <a href={window.yaymailData.smtp.setting} target="blank">
          Get started!
        </a>
      </div>
    </>
  );
};

const RecommendContent = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(window.yaymailData.smtp.is_active);
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const showNotifications = (type: NotificationType, message: React.ReactNode) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 5,
      className: 'yaymail-recommend__smtp__notifications',
    });
  };

  const handleInstallYaySMTP = async () => {
    try {
      setLoading(true);
      const response = await installYaySMTP();
      if (response.success) {
        setLoading(false);
        setIsActive(true);
        showNotifications('success', <SuccessNotifications />);
      } else {
        setLoading(false);
        showNotifications('error', 'Installed failed');
      }
    } catch (error) {
      setLoading(false);
      showNotifications('error', 'Installed failed');
      console.error(error);
    }
  };

  useEffect(() => {
    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const modalElement = document.getElementById('TB_window');
          if (modalElement) {
            modalElement.classList.add('plugin-details-modal');
          }
        }
      }
    };

    const observer = new MutationObserver(observerCallback);

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {notificationsContextHolder}
      {!isActive && (
        <div className="yaymail-recommend-content">
          <h4>{__('To send emails to inbox, we recommend:', 'yaymail')}</h4>
          <div className="yaymail-recommend">
            <div className="yaymail-recommend__smtp__img">
              <YaySMTPLogo />
            </div>
            <div className="yaymail-recommend__smtp">
              <h2 className="yaymail-recommend__smtp__title">YaySMTP – Simple WP SMTP Mail</h2>
              <div className="yaymail-recommend__smtp__action">
                <a
                  className="yaymail-recommend__smtp__detail button button thickbox open-plugin-details-modal"
                  target="_blank"
                  href={window.yaymailData.smtp.link_detail}
                  rel="noreferrer"
                >
                  Details
                </a>
                <Button
                  className="yaymail-recommend__smtp__btn-install button button-primary"
                  key="ok"
                  type="primary"
                  loading={loading}
                  onClick={handleInstallYaySMTP}
                >
                  Free Install Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Modal = ({ isOpen, onClose, ...rest }: IModalProps) => {
  return (
    <>
      <AntModal
        title={<ModalHeader content={<HeaderContent />} />}
        className="yaymail-global__modal yaymail-send-test-mail__modal"
        open={isOpen}
        onCancel={onClose}
        centered
        width={'500px'}
        footer={null}
        destroyOnClose
      >
        <div className="modal__content">
          <SendMailContent {...rest} />
          {!window.yaymailData.smtp.is_active && <RecommendContent />}
        </div>
      </AntModal>
    </>
  );
};

export default Modal;
