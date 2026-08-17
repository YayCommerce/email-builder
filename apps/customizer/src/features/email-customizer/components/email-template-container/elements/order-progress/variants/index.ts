import { filledBarVariant } from './filled-bar';
import { stepMarkerVariant } from './step-marker';
import type { OrderProgressDisplayStyle, OrderProgressVariant } from './types';

const VARIANTS: Record<OrderProgressDisplayStyle, OrderProgressVariant> = {
  step_marker: stepMarkerVariant,
  filled_bar: filledBarVariant,
};

export function getOrderProgressVariant(
  key: OrderProgressDisplayStyle | undefined,
): OrderProgressVariant {
  return VARIANTS[key ?? 'step_marker'] ?? VARIANTS.step_marker;
}
