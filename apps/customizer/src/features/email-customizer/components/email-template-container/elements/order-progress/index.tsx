import { CSSProperties, useMemo } from 'react';

import ElementWrapper from '@src/features/email-customizer/components/element-wrapper';

import { ITemplateProps } from '@src/features/email-customizer/type';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import withMemo from '../with-memo';
import { normalizeOrderProgressSteps } from './step-data';
import { getOrderProgressVariant } from './variants';
import type { OrderProgressDisplayStyle } from './variants/types';

const OrderProgressContent = ({ element }: ITemplateProps<'order_progress'>) => {
  const data = element.data;

  const steps = useMemo(() => normalizeOrderProgressSteps(data.steps), [data.steps]);

  const currentStepIndex = useMemo(() => {
    const idx = Number(data.current_step_index ?? 0);
    if (!Number.isFinite(idx)) return 0;
    return Math.max(0, Math.min(Math.floor(idx), Math.max(0, steps.length - 1)));
  }, [data.current_step_index, steps.length]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding?.top ?? 0),
      paddingRight: getDimensionValue(data.padding?.right ?? 0),
      paddingBottom: getDimensionValue(data.padding?.bottom ?? 0),
      paddingLeft: getDimensionValue(data.padding?.left ?? 0),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.padding, data.background_color],
  );

  const tableStyles: CSSProperties = useMemo(
    () => ({
      width: '100%',
      tableLayout: 'auto',
      borderCollapse: 'collapse',
      borderSpacing: 0,
    }),
    [],
  );

  const iconSizePx = useMemo(() => {
    const n = Number(data.icon_size ?? 18);
    return Math.max(10, Math.min(Number.isFinite(n) ? n : 18, 80));
  }, [data.icon_size]);

  const labelFontSizePx = useMemo(() => {
    const n = Number(data.label_font_size ?? 14);
    return Math.max(8, Math.min(Number.isFinite(n) ? n : 14, 24));
  }, [data.label_font_size]);

  const labelFontFamily = useMemo(() => {
    const raw = data.font_family;
    return typeof raw === 'string' && raw.trim() !== '' ? raw : 'Helvetica,Roboto,Arial,sans-serif';
  }, [data.font_family]);

  const connectorHeightPx = useMemo(() => {
    const n = Number(data.connector_height ?? 2);
    return Math.max(1, Math.min(Number.isFinite(n) ? n : 2, 10));
  }, [data.connector_height]);

  const displayStyle = useMemo<OrderProgressDisplayStyle>(() => {
    const raw = (data as any).display_style;
    return raw === 'filled_bar' ? 'filled_bar' : 'step_marker';
  }, [data]);

  const variant = useMemo(() => getOrderProgressVariant(displayStyle), [displayStyle]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-order-progress"
      element={element}
      style={wrapperStyles}
    >
      {variant.render({
        element,
        steps: steps as any,
        currentStepIndex,
        tableStyles,
        iconSizePx,
        labelFontSizePx,
        labelFontFamily,
        connectorHeightPx,
      })}
    </ElementWrapper>
  );
};

const OrderProgress = withMemo(OrderProgressContent);

export default OrderProgress;
