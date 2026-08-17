/**
 * Normalized Order Progress step fields (read path).
 * Writes use new keys in the sidebar; legacy keys remain in saved JSON with fallbacks here.
 */

import type { OrderProgressStep } from './variants/types';

export type IconBorderStyle = 'solid' | 'dashed' | 'dotted';

export type NormalizedOrderProgressStep = {
  labelColor: string;
  imageUrl: string;
  imageBgColor: string;
  iconBorderColor: string;
  iconBorderStyle: IconBorderStyle;
  iconBorderWidthPx: number;
};

const DEFAULT_ICON_BORDER_COLOR = '#c9a8ff';
const DEFAULT_ICON_BORDER_STYLE: IconBorderStyle = 'solid';
const DEFAULT_ICON_BORDER_WIDTH_PX = 2;
const DEFAULT_LABEL_COLOR = '#111827';

type LegacyStep = OrderProgressStep & {
  label_active_color?: string;
  label_inactive_color?: string;
  image_active_url?: string;
  image_inactive_url?: string;
  filled_bar_icon_border_color_active?: string;
  filled_bar_icon_border_color_inactive?: string;
};

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function parseBorderStyle(raw: unknown): IconBorderStyle {
  const value = readString(raw).toLowerCase();
  if (value === 'dashed' || value === 'dotted') {
    return value;
  }
  return DEFAULT_ICON_BORDER_STYLE;
}

function parseBorderWidthPx(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.max(0, Math.min(10, Math.round(raw)));
  }
  if (typeof raw === 'string') {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) {
      return Math.max(0, Math.min(10, Math.round(n)));
    }
  }
  return DEFAULT_ICON_BORDER_WIDTH_PX;
}

/** Read step image URL (new field with legacy fallback). */
export function getStepImageUrl(step: OrderProgressStep | undefined): string {
  if (!step) {
    return '';
  }
  const legacy = step as LegacyStep;
  return (
    readString(legacy.image_url) ||
    readString(legacy.image_active_url) ||
    readString(legacy.image_inactive_url)
  );
}

export type OrderProgressLabelColors = {
  labelActiveColor?: string;
  labelInactiveColor?: string;
};

/** Element-level active/inactive label colors (per-step legacy overrides on read). */
export function getStepLabelColor(
  step: OrderProgressStep | undefined,
  isStepActive: boolean,
  elementLabels: OrderProgressLabelColors,
): string {
  const legacy = (step ?? {}) as LegacyStep;

  const stepOverride = readString(legacy.label_color);
  if (stepOverride) {
    return stepOverride;
  }

  const legacyStepColor = isStepActive
    ? readString(legacy.label_active_color)
    : readString(legacy.label_inactive_color);
  if (legacyStepColor) {
    return legacyStepColor;
  }

  const activeColor = readString(elementLabels.labelActiveColor) || DEFAULT_LABEL_COLOR;
  const inactiveColor = readString(elementLabels.labelInactiveColor) || '#9CA3AF';

  return isStepActive ? activeColor : inactiveColor;
}

/** Filled-bar icon border (new fields with legacy fallback). */
export function getStepIconBorder(step: OrderProgressStep | undefined): {
  color: string;
  style: IconBorderStyle;
  widthPx: number;
} {
  const legacy = (step ?? {}) as LegacyStep;
  const color =
    readString(legacy.icon_border_color) ||
    readString(legacy.filled_bar_icon_border_color_active) ||
    readString(legacy.filled_bar_icon_border_color_inactive) ||
    DEFAULT_ICON_BORDER_COLOR;

  return {
    color,
    style: parseBorderStyle(legacy.icon_border_style),
    widthPx: parseBorderWidthPx(legacy.icon_border_width),
  };
}

export function normalizeOrderProgressStep(
  step: OrderProgressStep | undefined,
  isStepActive: boolean,
  elementLabels: OrderProgressLabelColors,
): NormalizedOrderProgressStep {
  const legacy = (step ?? {}) as LegacyStep;
  const border = getStepIconBorder(step);

  return {
    labelColor: getStepLabelColor(step, isStepActive, elementLabels),
    imageUrl: getStepImageUrl(step),
    imageBgColor: readString(legacy.image_bg_color),
    iconBorderColor: border.color,
    iconBorderStyle: border.style,
    iconBorderWidthPx: border.widthPx,
  };
}
