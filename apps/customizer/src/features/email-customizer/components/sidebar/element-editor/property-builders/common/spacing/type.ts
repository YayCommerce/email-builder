import { InputNumberProps } from 'antd';

export type SpacingType = {
  value_path?: string;
  min?: number;
  max?: number;
} & Omit<InputNumberProps, 'value' | 'onChange'>;
