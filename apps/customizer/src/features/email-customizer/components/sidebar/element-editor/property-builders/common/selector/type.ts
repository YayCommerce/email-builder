import { SelectProps } from 'antd';

export type SelectorType = {
  value_path?: string;
  default_value?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
} & Omit<SelectProps, 'value' | 'onChange'>;
