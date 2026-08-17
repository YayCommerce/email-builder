import { InputNumberProps } from 'antd';

export type MarginType = {
  value_path?: string;
  description?: string;
  min?: number;
  max?: number;
} & Omit<InputNumberProps, 'value' | 'onChange'>;
