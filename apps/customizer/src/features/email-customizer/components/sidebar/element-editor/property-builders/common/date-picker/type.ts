import { DatePickerProps } from 'antd';

export type DatePickerType = {
  value_path?: string;
  calendar_type?: 'single' | 'range';
} & DatePickerProps;
