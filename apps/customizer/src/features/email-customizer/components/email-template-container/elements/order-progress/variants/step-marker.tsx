import { CSSProperties } from 'react';

import { ORDER_PROGRESS_MAX_STEPS } from '../step-data';
import {
  type EdgeAlign,
  getConnectorSegmentColors,
  getStepImageUrl,
  getStepLabelColor,
  getStepMarkerEdgeTrackPaddingPx,
  STEP_MARKER_PRESETS,
  STEP_MARKER_RING_OUTER_PX,
  toStepCount,
} from './order-progress-variant-logic';
import type { OrderProgressStep, OrderProgressVariant } from './types';

const stepMarkerTableClass =
  'yaymail-element-order-progress yaymail-element-order-progress--step-marker';

const SMALL_DOT_PX = 14;
const RING_OUTER_PX = STEP_MARKER_RING_OUTER_PX;
const INNER_DOT_PX = 14;

/** Min bubble cell width (see bubbleCellSize). */
const MIN_BUBBLE_CELL_PX = 42;

/** Step-marker accent: per-step background when set, else connector active color. */
function resolveStepMarkerAccentColor(
  step: OrderProgressStep | undefined,
  connectorActiveColor: string,
): string {
  const stepBg = String(step?.image_bg_color ?? '').trim();
  return stepBg || connectorActiveColor;
}

/** Light ring color for current-step dot (email-safe hex). */
function blendHexWithWhite(hex: string, amount: number): string {
  const raw = hex.replace(/^#/, '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return '#C4B0E8';
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const to = (v: number) => v.toString(16).padStart(2, '0');
  return `#${to(mix(r))}${to(mix(g))}${to(mix(b))}`;
}

type MsoStyle = CSSProperties & { msoBorderRadius?: string };

type StepMarkerColors = {
  activePurple: string;
  inactiveGrey: string;
  ringBorderColor: string;
};

type StepMarkerSizes = {
  barHeight: number;
  dotRing: number;
  bubbleCellSize: number;
  bubbleRowMinHeight: number;
  iconSizePx: number;
  labelFontSizePx: number;
};

type StepMarkerRuntime = {
  activeIndex: number;
  // eslint-disable-next-line no-unused-vars
  isActive: (index: number) => boolean;
  // eslint-disable-next-line no-unused-vars
  isCurrent: (index: number) => boolean;
  // eslint-disable-next-line no-unused-vars
  leftConnectorColor: (index: number) => string;
  // eslint-disable-next-line no-unused-vars
  rightConnectorColor: (index: number) => string;
};

function createRuntime(
  n: number,
  activeIndex: number,
  colors: Pick<StepMarkerColors, 'activePurple' | 'inactiveGrey'>,
): StepMarkerRuntime {
  return {
    activeIndex,
    isActive: (i) => i <= activeIndex,
    isCurrent: (i) => i === activeIndex,
    leftConnectorColor: (i) =>
      getConnectorSegmentColors(i, activeIndex, n, colors.activePurple, colors.inactiveGrey).left,
    rightConnectorColor: (i) =>
      getConnectorSegmentColors(i, activeIndex, n, colors.activePurple, colors.inactiveGrey).right,
  };
}

function renderIconCell(args: {
  step: OrderProgressStep;
  index: number;
  n: number;
  pct: number;
  align: EdgeAlign;
  edgePaddingPx: number;
  teardropCellStyle: MsoStyle;
  sizes: Pick<StepMarkerSizes, 'bubbleCellSize' | 'bubbleRowMinHeight' | 'iconSizePx'>;
  colors: Pick<StepMarkerColors, 'activePurple' | 'inactiveGrey'>;
  runtime: Pick<StepMarkerRuntime, 'isActive' | 'isCurrent'>;
}): JSX.Element {
  const { step, index, pct, align, teardropCellStyle, sizes, colors, runtime } = args;
  const isStepActive = runtime.isActive(index);
  const isCurrent = runtime.isCurrent(index);

  const rawIconBgColor = step.image_bg_color ?? '';
  const iconBgColor = rawIconBgColor || (isStepActive ? colors.activePurple : colors.inactiveGrey);

  const imageUrl = isCurrent ? getStepImageUrl(step) : '';

  return (
    <td
      key={index}
      width={`${pct}%`}
      style={{
        width: `${pct}%`,
        verticalAlign: 'top',
        padding: 0,
        textAlign: align,
        height: sizes.bubbleRowMinHeight,
      }}
    >
      {isCurrent && imageUrl ? (
        <table
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          width={sizes.bubbleCellSize}
          align={align}
          style={{
            width: sizes.bubbleCellSize,
            margin: align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0',
            borderCollapse: 'collapse',
          }}
        >
          <tbody>
            <tr>
              <td
                width={sizes.bubbleCellSize}
                height={sizes.bubbleCellSize}
                align="center"
                valign="middle"
                style={{
                  ...teardropCellStyle,
                  backgroundColor: iconBgColor || 'transparent',
                }}
              >
                <img
                  src={imageUrl}
                  alt=""
                  width={sizes.iconSizePx}
                  height={sizes.iconSizePx}
                  style={{
                    display: 'block',
                    margin: '0 auto',
                    border: 0,
                    outline: 'none',
                    textDecoration: 'none',
                    width: `${sizes.iconSizePx}px`,
                    height: `${sizes.iconSizePx}px`,
                    objectFit: 'contain',
                  }}
                />
              </td>
            </tr>
            <tr>
              <td
                width={sizes.bubbleCellSize}
                align="center"
                style={{
                  width: sizes.bubbleCellSize,
                  padding: 0,
                  textAlign: 'center',
                  lineHeight: 0,
                  fontSize: 0,
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: `12px solid ${iconBgColor}`,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontSize: 0,
                    lineHeight: 0,
                    marginTop: '-2px',
                    zIndex: 100,
                    position: 'relative',
                  }}
                >
                  &nbsp;
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <span style={{ display: 'inline-block', height: sizes.bubbleRowMinHeight }} />
      )}
    </td>
  );
}

function renderTrackCell(args: {
  step: OrderProgressStep;
  index: number;
  pct: number;
  n: number;
  edgePaddingPx: number;
  sizes: Pick<StepMarkerSizes, 'barHeight' | 'dotRing'>;
  colors: StepMarkerColors;
  runtime: StepMarkerRuntime;
}): JSX.Element {
  const { step, index, pct, n, edgePaddingPx, sizes, colors, runtime } = args;

  const isStepActive = runtime.isActive(index);
  const isCurrent = runtime.isCurrent(index);
  const dotCellW = isCurrent ? RING_OUTER_PX : SMALL_DOT_PX;

  const leftConnectorColor = runtime.leftConnectorColor(index);
  const rightConnectorColor = runtime.rightConnectorColor(index);
  const plainDotFill = isStepActive ? colors.activePurple : colors.inactiveGrey;
  const currentDotAccent = resolveStepMarkerAccentColor(step, colors.activePurple);
  const currentRingBorderColor = blendHexWithWhite(currentDotAccent, 0.55);

  return (
    <td
      key={index}
      width={`${pct}%`}
      align="center"
      valign="middle"
      style={{
        width: `${pct}%`,
        verticalAlign: 'middle',
        padding: 0,
        paddingLeft: index === 0 ? edgePaddingPx : 0,
        paddingRight: index === n - 1 ? edgePaddingPx : 0,
        textAlign: 'center',
        lineHeight: 0,
        fontSize: 0,
      }}
    >
      <table
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        width="100%"
        style={{ borderCollapse: 'collapse' }}
      >
        <tbody>
          <tr>
            {index !== 0 && (
              <td valign="middle" style={{ verticalAlign: 'middle', padding: 0 }}>
                <div
                  style={{
                    height: `${sizes.barHeight}px`,
                    backgroundColor: leftConnectorColor,
                    width: '100%',
                    fontSize: 0,
                    lineHeight: 0,
                  }}
                >
                  &nbsp;
                </div>
              </td>
            )}

            <td
              width={dotCellW}
              align="center"
              valign="middle"
              style={{
                width: dotCellW,
                verticalAlign: 'middle',
                padding: 0,
                textAlign: 'center',
                lineHeight: 0,
                fontSize: 0,
              }}
            >
              {isCurrent ? (
                <div
                  style={{
                    width: `${RING_OUTER_PX}px`,
                    height: `${RING_OUTER_PX}px`,
                    borderRadius: `${RING_OUTER_PX / 2}px`,
                    border: `${sizes.dotRing}px solid ${currentRingBorderColor}`,
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: `${INNER_DOT_PX}px`,
                      height: `${INNER_DOT_PX}px`,
                      borderRadius: `${INNER_DOT_PX / 2}px`,
                      backgroundColor: currentDotAccent,
                      flexShrink: 0,
                      fontSize: 0,
                      lineHeight: 0,
                    }}
                  >
                    &nbsp;
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: SMALL_DOT_PX,
                    height: SMALL_DOT_PX,
                    borderRadius: SMALL_DOT_PX / 2,
                    backgroundColor: plainDotFill,
                    margin: '0 3px',
                    fontSize: 0,
                    lineHeight: 0,
                    outline: '3px solid #ffffff',
                  }}
                >
                  &nbsp;
                </div>
              )}
            </td>

            {index !== n - 1 && (
              <td valign="middle" style={{ verticalAlign: 'middle', padding: 0 }}>
                <div
                  style={{
                    height: `${sizes.barHeight}px`,
                    backgroundColor: rightConnectorColor,
                    width: '100%',
                    fontSize: 0,
                    lineHeight: 0,
                  }}
                >
                  &nbsp;
                </div>
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </td>
  );
}

function renderLabelCell(args: {
  step: OrderProgressStep;
  index: number;
  pct: number;
  align: EdgeAlign;
  elementData: any;
  labelFontSizePx: number;
  labelFontFamily: string;
  runtime: Pick<StepMarkerRuntime, 'isActive'>;
}): JSX.Element {
  const { step, index, pct, align, elementData, labelFontSizePx, labelFontFamily, runtime } = args;

  const labelColors = {
    labelActiveColor: elementData.label_active_color ?? '#111827',
    labelInactiveColor: elementData.label_inactive_color ?? '#9CA3AF',
  };
  const isStepActive = runtime.isActive(index);
  const labelColor = getStepLabelColor(step, isStepActive, labelColors);

  const title = step.title ?? (step as any).label ?? '';

  const labelStyles: CSSProperties = {
    margin: 0,
    padding: 0,
    fontFamily: labelFontFamily,
    fontSize: `${labelFontSizePx}px`,
    lineHeight: 1.2,
    color: labelColor || '#111827',
    textAlign: align,
  };

  return (
    <td
      key={index}
      width={`${pct}%`}
      align={align}
      style={{
        width: `${pct}%`,
        verticalAlign: 'top',
        padding: 0,
        textAlign: align,
      }}
    >
      {title ? <p style={labelStyles}>{title}</p> : null}
    </td>
  );
}

export const stepMarkerVariant: OrderProgressVariant = {
  key: 'step_marker',
  render: ({
    element,
    steps,
    currentStepIndex,
    tableStyles,
    iconSizePx,
    labelFontSizePx,
    labelFontFamily,
    connectorHeightPx,
  }) => {
    const data = element.data as any;
    const activePurple = data.connector_active_color || '#873eff';
    const inactiveGrey = data.connector_inactive_color || '#E2E6EE';
    const barHeight = Math.max(1, connectorHeightPx);
    const dotRing = 3;
    const bubblePadding = 6;
    const bubbleSize = iconSizePx + bubblePadding * 2;
    const bubbleCellSize = Math.max(MIN_BUBBLE_CELL_PX, bubbleSize);
    const bubbleRowMinHeight = Math.max(bubbleSize, bubbleCellSize);
    const edgePaddingPx = getStepMarkerEdgeTrackPaddingPx(bubbleCellSize);

    const displaySteps = steps.slice(0, ORDER_PROGRESS_MAX_STEPS) as OrderProgressStep[];
    const nRaw = displaySteps.length;
    if (nRaw === 0) {
      return null;
    }

    const n = toStepCount(nRaw);
    const activeIndex = Math.min(Math.max(0, currentStepIndex), n - 1);
    const preset = STEP_MARKER_PRESETS[n];
    const colspan = n;
    const tableBaseStyle = tableStyles;
    const colors: StepMarkerColors = {
      activePurple,
      inactiveGrey,
      ringBorderColor: blendHexWithWhite(activePurple, 0.55),
    };
    const sizes: StepMarkerSizes = {
      barHeight,
      dotRing,
      bubbleCellSize,
      bubbleRowMinHeight,
      iconSizePx,
      labelFontSizePx,
    };
    const runtime = createRuntime(n, activeIndex, { activePurple, inactiveGrey });

    const teardropCellStyle: MsoStyle = {
      width: bubbleCellSize,
      height: bubbleCellSize,
      backgroundColor: 'transparent',
      borderRadius: '35%',
      msoBorderRadius: '35%',
      textAlign: 'center',
      verticalAlign: 'middle',
      padding: 0,
    };

    return (
      <div style={{ width: '100%' }}>
        <table
          className={stepMarkerTableClass}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          width="100%"
          style={tableBaseStyle}
        >
          <tbody>
            <tr className="yaymail-element-order-progress--step-marker-icon-row">
              {displaySteps.map((step, index) =>
                renderIconCell({
                  step,
                  index,
                  n,
                  pct: preset.columnWidthsPct[index] ?? 100,
                  align: preset.edgeAligns[index] ?? 'center',
                  edgePaddingPx,
                  teardropCellStyle,
                  sizes: {
                    bubbleCellSize: sizes.bubbleCellSize,
                    bubbleRowMinHeight: sizes.bubbleRowMinHeight,
                    iconSizePx: sizes.iconSizePx,
                  },
                  colors: { activePurple: colors.activePurple, inactiveGrey: colors.inactiveGrey },
                  runtime,
                }),
              )}
            </tr>

            <tr className="yaymail-element-order-progress--step-marker-track-row">
              <td colSpan={colspan} style={{ padding: '0' }}>
                <table
                  className="yaymail-element-order-progress--step-marker-track-inner"
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  width="100%"
                  style={tableBaseStyle}
                >
                  <tbody>
                    <tr>
                      {displaySteps.map((step, index) =>
                        renderTrackCell({
                          step,
                          index,
                          pct: preset.columnWidthsPct[index] ?? 100,
                          n,
                          edgePaddingPx,
                          sizes: { barHeight: sizes.barHeight, dotRing: sizes.dotRing },
                          colors,
                          runtime,
                        }),
                      )}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr className="yaymail-element-order-progress--step-marker-labels-row">
              <td colSpan={colspan} style={{ padding: '10px 0 0' }}>
                <table
                  className="yaymail-element-order-progress--step-marker-labels-inner"
                  cellPadding="0"
                  cellSpacing="0"
                  role="presentation"
                  width="100%"
                  style={tableBaseStyle}
                >
                  <tbody>
                    <tr>
                      {displaySteps.map((step, index) =>
                        renderLabelCell({
                          step,
                          index,
                          pct: preset.columnWidthsPct[index] ?? 100,
                          align: preset.edgeAligns[index] ?? 'center',
                          elementData: data,
                          labelFontSizePx: sizes.labelFontSizePx,
                          labelFontFamily,
                          runtime,
                        }),
                      )}
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },
};
