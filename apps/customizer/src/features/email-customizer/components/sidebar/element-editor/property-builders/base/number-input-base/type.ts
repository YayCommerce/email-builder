/* eslint-disable no-unused-vars */
import { CSSProperties } from 'react';

import { InputNumberProps } from 'antd';
export interface NumberInputBasePropsType extends Omit<InputNumberProps, 'onChange'> {
  label?: string;
  value: number;
  // onChange: (v: number) => void;
  min?: number;
  max: number;
  step?: number;
  default?: number;
  style?: CSSProperties;
  onChange?: ((value: number) => void) | undefined;
}
