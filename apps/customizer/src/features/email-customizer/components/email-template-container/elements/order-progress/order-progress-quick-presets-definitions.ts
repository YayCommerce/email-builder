/**
 * Quick preset bundles for Order Progress (Customizer only). No preset id is persisted in element data.
 *
 * Four reference styles:
 * 1. Blue serif timeline — thick blue track, small dots, serif labels (step_marker).
 * 2. Purple icon bar — filled circles, purple vs grey connectors (filled_bar).
 * 3. Gold check circles — yellow icons, dark stroke, pale cream connectors (filled_bar).
 * 4. Red rounded blocks — red squircle icons, pink connectors, rounded sans (filled_bar).
 *
 * Applying a preset merges visual style into existing steps (title preserved, count preserved).
 * Steps after the active step index get inactive grey icon background and border by default.
 */

import type { ElementDataTypeMap } from '@src/features/email-customizer/type';
import { __ } from '@wordpress/i18n';

import {
  getDefaultOrderProgressStepIconUrl,
  ORDER_PROGRESS_INACTIVE_STEP_ICON_BG,
  ORDER_PROGRESS_INACTIVE_STEP_ICON_BORDER,
} from './step-data';
import type { OrderProgressStep } from './variants/types';

export type OrderProgressElementData = ElementDataTypeMap['order_progress'];

/**
 * First quick preset id; PHP element defaults and the sidebar radio should stay aligned with `getOrderProgressQuickPresetPatch()` for this value.
 */
export const ORDER_PROGRESS_DEFAULT_QUICK_PRESET_ID = 'classic_blue';

const DEFAULT_SANS = 'Helvetica,Roboto,Arial,sans-serif';

type StepColors = {
  imageBg: string;
  iconBorderColor?: string;
};

/** Style-only fields extracted from a preset step (no title). */
export type OrderProgressStepStyle = Omit<OrderProgressStep, 'title'>;

export type OrderProgressPresetPatch = {
  /** Fields to set directly on element data (no steps). */
  elementStyle: Omit<Partial<OrderProgressElementData>, 'steps'>;
  /** Style for steps at or before current_step_index. */
  activeStepStyle: OrderProgressStepStyle;
  /** Style for steps after current_step_index (grey icon pill by default). */
  inactiveStepStyle: OrderProgressStepStyle;
};

function makeInactiveStepStyle(): OrderProgressStepStyle {
  return {
    image_url: getDefaultOrderProgressStepIconUrl(),
    image_bg_color: ORDER_PROGRESS_INACTIVE_STEP_ICON_BG,
    icon_border_color: ORDER_PROGRESS_INACTIVE_STEP_ICON_BORDER,
    icon_border_style: 'solid',
    icon_border_width: 2,
  };
}

function makeStepMarkerActiveStyle(colors: StepColors): OrderProgressStepStyle {
  return {
    image_url: getDefaultOrderProgressStepIconUrl(),
    image_bg_color: colors.imageBg,
  };
}

function makeFilledBarActiveStyle(
  colors: Required<Pick<StepColors, 'imageBg' | 'iconBorderColor'>>,
): OrderProgressStepStyle {
  return {
    image_url: getDefaultOrderProgressStepIconUrl(),
    image_bg_color: colors.imageBg,
    icon_border_color: colors.iconBorderColor,
    icon_border_style: 'solid',
    icon_border_width: 2,
  };
}

/**
 * Merge preset step styles into existing steps, preserving title and count.
 * Steps at index <= currentStepIndex get activeStepStyle; later steps get inactiveStepStyle.
 * If existing steps is empty or undefined, falls back to 3 default steps.
 */
export function mergePresetIntoSteps(
  existingSteps: OrderProgressStep[] | undefined,
  activeStepStyle: OrderProgressStepStyle,
  inactiveStepStyle: OrderProgressStepStyle,
  currentStepIndex: number,
): OrderProgressStep[] {
  const fallbackTitles = [
    __('Ordered', 'yaymail'),
    __('Processing', 'yaymail'),
    __('Completed', 'yaymail'),
  ];

  const base =
    existingSteps && existingSteps.length > 0
      ? existingSteps
      : fallbackTitles.map((title) => ({ title } as OrderProgressStep));

  const activeIndex = Math.min(
    Math.max(0, Math.floor(Number(currentStepIndex))),
    Math.max(0, base.length - 1),
  );

  return base.map((step, index) => ({
    ...step,
    ...(index <= activeIndex ? activeStepStyle : inactiveStepStyle),
  }));
}

/**
 * Selector options (value stable; labels translated).
 */
export function getOrderProgressQuickPresetOptions(): { value: string; label: string }[] {
  return [
    { value: 'classic_blue', label: __('Blue serif timeline', 'yaymail') },
    { value: 'filled_modern', label: __('Purple icon bar', 'yaymail') },
    { value: 'minimal_line', label: __('Gold check circles', 'yaymail') },
    { value: 'filled_warm', label: __('Red rounded blocks', 'yaymail') },
  ];
}

/**
 * Returns a preset patch (element style + per-step style template).
 * Call at apply time (browser) so asset URLs resolve.
 */
export function getOrderProgressQuickPresetPatch(
  presetValue: string,
): OrderProgressPresetPatch | null {
  const inactiveStepStyle = makeInactiveStepStyle();

  switch (presetValue) {
    case 'classic_blue':
      return {
        elementStyle: {
          display_style: 'step_marker',
          connector_height: 4,
          connector_active_color: '#2563eb',
          connector_inactive_color: '#bfdbfe',
          label_active_color: '#636363',
          label_inactive_color: '#71717a',
          font_family: 'Georgia, "Times New Roman", Times, serif',
          filled_bar_icon_border_radius: 50,
        },
        activeStepStyle: makeStepMarkerActiveStyle({
          imageBg: '#2563eb',
        }),
        inactiveStepStyle,
      };

    case 'filled_modern':
      return {
        elementStyle: {
          display_style: 'filled_bar',
          connector_height: 2,
          connector_active_color: '#873eff',
          connector_inactive_color: '#e5e7eb',
          label_active_color: '#111827',
          label_inactive_color: '#9ca3af',
          font_family: DEFAULT_SANS,
          filled_bar_icon_border_radius: 50,
        },
        activeStepStyle: makeFilledBarActiveStyle({
          imageBg: '#873eff',
          iconBorderColor: '#a78bfa',
        }),
        inactiveStepStyle,
      };

    case 'minimal_line':
      return {
        elementStyle: {
          display_style: 'filled_bar',
          connector_height: 2,
          connector_active_color: '#f5e6d3',
          connector_inactive_color: '#faf3e0',
          label_active_color: '#1f2937',
          label_inactive_color: '#6b7280',
          font_family: DEFAULT_SANS,
          filled_bar_icon_border_radius: 50,
        },
        activeStepStyle: makeFilledBarActiveStyle({
          imageBg: '#eab308',
          iconBorderColor: '#1f2937',
        }),
        inactiveStepStyle,
      };

    case 'filled_warm':
      return {
        elementStyle: {
          display_style: 'filled_bar',
          connector_height: 2,
          connector_active_color: '#fbcfe8',
          connector_inactive_color: '#fce7f3',
          label_active_color: '#374151',
          label_inactive_color: '#9ca3af',
          font_family: '"Comic Sans MS", cursive, sans-serif',
          filled_bar_icon_border_radius: 12,
        },
        activeStepStyle: makeFilledBarActiveStyle({
          imageBg: '#dc2626',
          iconBorderColor: '#fecaca',
        }),
        inactiveStepStyle,
      };

    default:
      return null;
  }
}
