import { CheckboxGroupProps } from 'antd/es/checkbox/Group';

export type CheckboxGroupType = CheckboxGroupProps & {
  value_path?: string;
  number_of_columns?: number;
};
