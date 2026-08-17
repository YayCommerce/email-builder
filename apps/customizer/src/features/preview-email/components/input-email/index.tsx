import React from 'react';

import { Alert, Input, InputProps } from 'antd';

import { __ } from '@wordpress/i18n';

import './index.scss';

type Props = {
  // eslint-disable-next-line no-unused-vars
  setEmailAddress: (value: string) => void;
  isValidEmail: boolean;
} & InputProps;

const InputEmail: React.FC<Props> = ({ setEmailAddress, isValidEmail, ...restInputProps }) => {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;
    setEmailAddress(value);
  };

  return (
    <>
      <Input
        style={{ width: '100%' }}
        type="email"
        className="yaymail-send-email__content__text yaymail-preview-email__input"
        placeholder="Ex: help.yaycommerce@gmail.com"
        onChange={handleChange}
        size="middle"
        allowClear={true}
        status={isValidEmail ? '' : 'error'}
        {...restInputProps}
      />
      {!isValidEmail && (
        <Alert
          message={__('Invalid email address', 'yaymail')}
          type="error"
          showIcon
          style={{ marginTop: '8px' }}
        />
      )}
      <p style={{ fontStyle: 'italic', marginTop: 5 }}>
        {__('Leave this empty to preview email only', 'yaymail')}
      </p>
    </>
  );
};

export default InputEmail;
