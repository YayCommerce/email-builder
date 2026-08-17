/**
 * Order Progress variant: layout presets + pure helpers (Customizer).
 * Mirrors PHP OrderProgressVariantHelpers; presets must stay in sync with get_step_marker_presets().
 */

// --- Layout presets (column widths / edge align per step count) ---

export type EdgeAlign = 'left' | 'center' | 'right';
export type StepCount = 1 | 2 | 3 | 4 | 5;

export type StepMarkerPreset = {
  /** Column widths (percent) per step — must sum to 100. */
  columnWidthsPct: readonly number[];
  /** Alignment per step column (used for icon + label edge align). */
  edgeAligns: readonly EdgeAlign[];
};

/**
 * Step-marker layout presets.
 * We cap to 5 steps; keep this table explicit to avoid layout math in render.
 */
export const STEP_MARKER_PRESETS: Record<StepCount, StepMarkerPreset> = {
  1: { columnWidthsPct: [100], edgeAligns: ['center'] },
  2: { columnWidthsPct: [50, 50], edgeAligns: ['left', 'right'] },
  3: { columnWidthsPct: [33, 34, 33], edgeAligns: ['left', 'center', 'right'] },
  4: {
    columnWidthsPct: [12, 25, 25, 12],
    edgeAligns: ['left', 'center', 'center', 'right'],
  },
  5: {
    columnWidthsPct: [9, 20, 20, 20, 9],
    edgeAligns: ['left', 'center', 'center', 'center', 'right'],
  },
};

export function toStepCount(n: number): StepCount {
  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  if (n === 4) return 4;
  return 5;
}

/** Step-marker current-step ring outer diameter (px). Keep in sync with step-marker.php `$ring_outer_px`. */
export const STEP_MARKER_RING_OUTER_PX = 28;

/**
 * Track padding on first/last columns so the marker center lines up with the teardrop bubble center.
 * Keep in sync with step-marker.php `$edge_track_padding_px`.
 */
export function getStepMarkerEdgeTrackPaddingPx(
  bubbleCellSize: number,
  markerPx: number = STEP_MARKER_RING_OUTER_PX,
): number {
  return Math.max(0, Math.round(bubbleCellSize / 2 - markerPx / 2));
}

// --- Pure helpers (connector, image URL, label / icon colors) ---

export type ConnectorSegmentColors = {
  left: string;
  right: string;
};

/**
 * Connector segment colors for the filled-bar inner table (left bar, icon, right bar).
 */
export function getConnectorSegmentColors(
  index: number,
  activeIndex: number,
  n: number,
  activeColor: string,
  inactiveColor: string,
): ConnectorSegmentColors {
  const left = index === 0 ? 'transparent' : index <= activeIndex ? activeColor : inactiveColor;
  const right = index === n - 1 ? 'transparent' : index < activeIndex ? activeColor : inactiveColor;
  return { left, right };
}

export {
  getStepIconBorder,
  getStepImageUrl,
  getStepLabelColor,
  normalizeOrderProgressStep,
} from '../order-progress-step-fields';
