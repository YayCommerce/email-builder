import { InputProps } from 'antd';
import { TextAreaProps } from 'antd/es/input';

export type InputType = {
  value_path?: string;
  default_value?: string;
  validation_message?: string | null;
} & InputProps &
  TextAreaProps;
