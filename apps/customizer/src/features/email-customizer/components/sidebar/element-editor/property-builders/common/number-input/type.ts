import { NumberInputBasePropsType } from '../../base/number-input-base/type';

export type NumberInputType = {
  value_path?: string;
  title?: string;
  min?: number;
  max?: number;
  max_dependency?: string;
  is_debounce?: boolean;
  debounce_time?: number;
} & NumberInputBasePropsType;
