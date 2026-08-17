import { SelectProps } from 'antd';

export type SelectorType = SelectProps & {
  onPopupScrollBottom?: () => void;
};
