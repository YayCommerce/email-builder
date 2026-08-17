import React from 'react';

import { Button } from 'antd';

import { __ } from '@wordpress/i18n';

import './index.scss';
import styles from './styles.module.scss';

interface IModalHeaderProps {
  content: React.ReactNode;
}

interface IModalFooterProps {
  isLoading?: boolean;
  okText: string;
  cancelText?: string;
  isButtonOkDisabled?: boolean;
  onOk: () => void;
  onCancel: () => void;
}

export const ModalFooter: React.FC<IModalFooterProps> = ({
  isLoading,
  okText,
  cancelText,
  onOk,
  onCancel,
  isButtonOkDisabled,
}) => {
  return (
    <div className="modal__footer">
      <Button
        key="ok"
        type="primary"
        loading={isLoading}
        onClick={onOk}
        disabled={isButtonOkDisabled}
      >
        {__(okText)}
      </Button>
      <Button key="back" onClick={onCancel} disabled={isLoading}>
        {cancelText ?? __('Cancel', 'yaymail')}
      </Button>
    </div>
  );
};

export const ModalHeader: React.FC<IModalHeaderProps> = ({ content }) => {
  return <div className={styles['modal_header']}>{content}</div>;
};
