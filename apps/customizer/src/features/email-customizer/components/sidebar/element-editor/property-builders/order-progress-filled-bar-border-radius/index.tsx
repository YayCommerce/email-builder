import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../types';
import Dimension from '../common/dimension';

const FILLED_BAR_ICON_BORDER_MAX_PX = 50;
const FILLED_BAR_ICON_BORDER_DEFAULT_PX = 50;

type OrderProgressFilledBarBorderRadiusProps = {
  value_path?: string;
  title?: string;
  default_value?: number | string;
};

function parseDefaultBorderRadiusPx(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.min(FILLED_BAR_ICON_BORDER_MAX_PX, Math.max(0, Math.round(raw)));
  }
  if (typeof raw === 'string') {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) {
      return Math.min(FILLED_BAR_ICON_BORDER_MAX_PX, Math.max(0, Math.round(n)));
    }
  }
  return FILLED_BAR_ICON_BORDER_DEFAULT_PX;
}

const OrderProgressFilledBarBorderRadius: PropertyBuilderComponentType<
  OrderProgressFilledBarBorderRadiusProps
> = (props?) => {
  const displayStyle =
    useTemplateContentStore(
      (state) =>
        (state.chosenElement?.type === 'order_progress' &&
          (state.chosenElement.data as any)?.display_style) ||
        undefined,
    ) ?? 'step_marker';

  const defaultValueNumber = parseDefaultBorderRadiusPx(props?.default_value);

  if (displayStyle !== 'filled_bar') {
    return null;
  }

  const valuePath = props?.value_path ?? 'filled_bar_icon_border_radius';
  const title = props?.title ?? __('Icon border radius (px)', 'yaymail');

  return (
    <Dimension
      value_path={valuePath}
      title={title}
      default_value={defaultValueNumber}
      min={0}
      max={FILLED_BAR_ICON_BORDER_MAX_PX}
      unit="px"
    />
  );
};

export default OrderProgressFilledBarBorderRadius;
