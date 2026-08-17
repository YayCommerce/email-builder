import { InputNumberProps } from 'antd';

export type BorderRadiusType = {
  value_path?: string;
  min?: number;
  max?: number;
} & Omit<InputNumberProps, 'value' | 'onChange'>;
