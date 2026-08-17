import { useMemo } from 'react';

import { InputNumber, Space } from 'antd';

import { isDefined } from '@yaymail/utilities/src/functions';
import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import { NumberInputBasePropsType } from './type';

import './index.scss';

const NumberInputBase = (props: NumberInputBasePropsType) => {
  const { onChange, className, style, label, ...rest } = props;

  const handleChangeValue = (value: number | null) => {
    if (!isDefined(value)) {
      return;
    }

    onChange?.(value);
  };

  const id = useMemo(() => uuidv4(), []);

  return (
    <Space
      direction="vertical"
      className={classNames('yaymail-number-input', className)}
      style={style}
    >
      {label && (
        <label htmlFor={id} className="yaymail-number-input-label">
          {label}
        </label>
      )}
      <InputNumber id={id} onChange={handleChangeValue as any} {...rest} />
    </Space>
  );
};

export default NumberInputBase;
