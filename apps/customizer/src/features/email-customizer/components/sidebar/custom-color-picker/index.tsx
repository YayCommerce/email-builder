import { useMemo } from 'react';

import { ColorPicker } from 'antd';

import YAYMAIL_TOKENS from '@src/constants/tokens';

import { ICustomColorPickerProps } from '../type';

import './index.scss';
import classNames from 'classnames';

const CustomColorPicker = (props: ICustomColorPickerProps) => {
  const { defaultValue, buttonLabel, value, title, onChange, ...restProps } = props;

  const usingColor = useMemo(() => {
    let result = value ?? defaultValue ?? YAYMAIL_TOKENS.color.wcPurple.default;
    if (typeof result === 'string') return result;
    return (result as any)?.default_value ?? '';
  }, [value, defaultValue]);

  return (
    <div className="yaymail-editor-property yaymail-custom-color-picker">
      {title && <div className="yaymail-title">{title}</div>}
      <ColorPicker defaultValue={usingColor} value={usingColor} onChange={onChange} {...restProps}>
        <span
          className={classNames('yaymail-custom-color-picker-button', {
            disabled: restProps.disabled,
          })}
        >
          <span
            className="yaymail-custom-color-picker__sample"
            style={{ backgroundColor: usingColor }}
          />
          <span className="yaymail-custom-color-picker__label">
            {buttonLabel ?? 'Select Color'}
          </span>
        </span>
      </ColorPicker>
    </div>
  );
};

export default CustomColorPicker;