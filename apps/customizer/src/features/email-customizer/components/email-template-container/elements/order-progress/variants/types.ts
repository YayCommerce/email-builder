import { CSSProperties } from 'react';

import type { ElementDataTypeMap, IElement } from '@src/features/email-customizer/type';

export type OrderProgressDisplayStyle = 'step_marker' | 'filled_bar';

export type OrderProgressStep = ElementDataTypeMap['order_progress']['steps'][number] & {
  // Backward-compatible field name
  label?: string;
};

export type OrderProgressVariantRenderProps = {
  element: IElement<'order_progress'>;
  steps: OrderProgressStep[];
  currentStepIndex: number;
  tableStyles: CSSProperties;
  iconSizePx: number;
  labelFontSizePx: number;
  /** Resolved font stack for step labels (email output). */
  labelFontFamily: string;
  connectorHeightPx: number;
};

export type OrderProgressVariant = {
  key: OrderProgressDisplayStyle;
  render: (props: OrderProgressVariantRenderProps) => JSX.Element | null;
};
