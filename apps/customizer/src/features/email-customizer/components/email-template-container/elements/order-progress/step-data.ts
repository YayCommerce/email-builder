import { __ } from '@wordpress/i18n';

import type { OrderProgressStep } from './variants/types';

/** Max steps shown in email/preview and allowed via Add step in the editor. */
export const ORDER_PROGRESS_MAX_STEPS = 5;

/** Default icon pill colors for steps not yet reached (user can override per step). */
export const ORDER_PROGRESS_INACTIVE_STEP_ICON_BG = '#E2E6EE';
export const ORDER_PROGRESS_INACTIVE_STEP_ICON_BORDER = '#E2E6EE';

/**
 * Ensures steps are a dense 0..n-1 array (templates may store steps as an object map).
 */
export function normalizeOrderProgressSteps(steps: unknown): OrderProgressStep[] {
  if (!steps) {
    return [];
  }

  if (Array.isArray(steps)) {
    return steps.filter((step) => step != null) as OrderProgressStep[];
  }

  if (typeof steps === 'object') {
    return Object.keys(steps as Record<string, OrderProgressStep>)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => (steps as Record<string, OrderProgressStep>)[key])
      .filter((step) => step != null);
  }

  return [];
}

/**
 * Default step icon URL (check.png), mirrors PHP `YAYMAIL_PLUGIN_URL . 'assets/images/check.png'`.
 */
export function getDefaultOrderProgressStepIconUrl(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  const baseUrl = window.yaymailData?.urls?.asset_url;
  return baseUrl ? `${baseUrl}check.png` : '';
}

/**
 * Creates one step object matching order_progress element data shape.
 * Use when adding a step in the sidebar or for tests.
 */
export function createEmptyOrderProgressStep(
  partial?: Partial<OrderProgressStep>,
): OrderProgressStep {
  return {
    title: __('Step', 'yaymail'),
    image_url: getDefaultOrderProgressStepIconUrl(),
    image_bg_color: ORDER_PROGRESS_INACTIVE_STEP_ICON_BG,
    icon_border_color: ORDER_PROGRESS_INACTIVE_STEP_ICON_BORDER,
    icon_border_style: 'solid',
    icon_border_width: 2,
    ...partial,
  };
}
