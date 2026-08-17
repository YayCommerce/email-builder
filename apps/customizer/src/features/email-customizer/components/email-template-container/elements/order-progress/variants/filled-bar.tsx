import { CSSProperties } from 'react';

import { ORDER_PROGRESS_MAX_STEPS } from '../step-data';
import {
  getConnectorSegmentColors,
  getStepIconBorder,
  getStepImageUrl,
  getStepLabelColor,
  STEP_MARKER_PRESETS,
  toStepCount,
} from './order-progress-variant-logic';
import type { OrderProgressStep } from './types';
import type { OrderProgressVariant } from './types';

/** Min bubble cell width (see bubbleCellSize). */
const MIN_BUBBLE_CELL_PX = 44;
const SMALL_DOT_PX = 14;
const PILL_PADDING_PX = 10;
const CONNECTOR_GAP_PX = 8;

export const filledBarVariant: OrderProgressVariant = {
  key: 'filled_bar',
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

    const displaySteps = steps.slice(0, ORDER_PROGRESS_MAX_STEPS) as OrderProgressStep[];
    const nRaw = displaySteps.length;
    if (nRaw === 0) {
      return null;
    }

    const n = toStepCount(nRaw);
    const activeIndex = Math.min(Math.max(0, Math.floor(Number(currentStepIndex))), n - 1);
    const preset = STEP_MARKER_PRESETS[n];
    const labelColors = {
      labelActiveColor: data.label_active_color ?? '#111827',
      labelInactiveColor: data.label_inactive_color ?? '#9CA3AF',
    };

    const iconBorderRadius = Number.isFinite(Number(data.filled_bar_icon_border_radius))
      ? Number(data.filled_bar_icon_border_radius)
      : 50;

    return (
      <table
        className="yaymail-element-order-progress yaymail-element-order-progress--filled-bar"
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        width="100%"
        style={tableStyles}
      >
        <tbody>
          <tr className="yaymail-element-order-progress--filled-bar-track-row">
            <td colSpan={n} style={{ padding: 0 }}>
              <table
                className="yaymail-element-order-progress--step-marker-track-inner yaymail-element-order-progress--filled-bar-track-inner"
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
                width="100%"
                style={tableStyles}
              >
                <tbody>
                  <tr>
                    {displaySteps.map((step, index) => {
                      const stepIndex = index;
                      const isStepActive = stepIndex <= activeIndex;
                      const imageUrl = getStepImageUrl(step);
                      const showIconPill = imageUrl !== '';

                      const rawIconBg = String(step.image_bg_color ?? '').trim();
                      const iconBgColor = rawIconBg || (isStepActive ? activePurple : inactiveGrey);

                      const {
                        color: iconBorderColor,
                        style: iconBorderStyle,
                        widthPx,
                      } = getStepIconBorder(step);

                      const pct = preset.columnWidthsPct[index] ?? 100;
                      const plainDotFill = isStepActive ? activePurple : inactiveGrey;
                      const pillOuterPx =
                        iconSizePx + PILL_PADDING_PX * 2 + Math.max(0, widthPx) * 2;
                      const markerCellW = showIconPill
                        ? Math.max(MIN_BUBBLE_CELL_PX, pillOuterPx)
                        : SMALL_DOT_PX;

                      const { left: leftColor, right: rightColor } = getConnectorSegmentColors(
                        index,
                        activeIndex,
                        n,
                        activePurple,
                        inactiveGrey,
                      );

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
                                  <td
                                    valign="middle"
                                    style={{
                                      verticalAlign: 'middle',
                                      padding: 0,
                                      paddingRight: CONNECTOR_GAP_PX,
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: `${barHeight}px`,
                                        backgroundColor: leftColor,
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
                                  width={markerCellW}
                                  align="center"
                                  valign="middle"
                                  style={{
                                    width: markerCellW,
                                    verticalAlign: 'middle',
                                    padding: 0,
                                    textAlign: 'center',
                                    lineHeight: 0,
                                  }}
                                >
                                  {showIconPill ? (
                                    <span
                                      style={{
                                        display: 'inline-block',
                                        backgroundColor: iconBgColor || 'transparent',
                                        borderRadius: iconBorderRadius,
                                        padding: `${PILL_PADDING_PX}px`,
                                        verticalAlign: 'middle',
                                        borderWidth: widthPx,
                                        borderColor: iconBorderColor,
                                        borderStyle: iconBorderStyle,
                                      }}
                                    >
                                      <img
                                        src={imageUrl}
                                        alt=""
                                        width={iconSizePx}
                                        height={iconSizePx}
                                        style={{
                                          display: 'block',
                                          margin: '0 auto',
                                          border: 0,
                                          outline: 'none',
                                          textDecoration: 'none',
                                          width: `${iconSizePx}px`,
                                          height: `${iconSizePx}px`,
                                          opacity: isStepActive ? 1 : 0.55,
                                          objectFit: 'contain',
                                        }}
                                      />
                                    </span>
                                  ) : (
                                    <div
                                      style={{
                                        width: SMALL_DOT_PX,
                                        height: SMALL_DOT_PX,
                                        borderRadius: SMALL_DOT_PX / 2,
                                        backgroundColor: plainDotFill,
                                        margin: '0 auto',
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
                                  <td
                                    valign="middle"
                                    style={{
                                      verticalAlign: 'middle',
                                      padding: 0,
                                      paddingLeft: CONNECTOR_GAP_PX,
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: `${barHeight}px`,
                                        backgroundColor: rightColor,
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
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr className="yaymail-element-order-progress--filled-bar-labels-row">
            <td colSpan={n} style={{ padding: '0' }}>
              <table
                className="yaymail-element-order-progress--filled-bar-labels-inner"
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
                width="100%"
                style={tableStyles}
              >
                <tbody>
                  <tr>
                    {displaySteps.map((step, index) => {
                      const pct = preset.columnWidthsPct[index] ?? 100;
                      const isStepActive = index <= activeIndex;

                      const labelColor = getStepLabelColor(step, isStepActive, labelColors);

                      const title = step.title ?? (step as any).label ?? '';

                      const labelStyles: CSSProperties = {
                        margin: '8px 0 0',
                        padding: 0,
                        fontFamily: labelFontFamily,
                        fontSize: `${labelFontSizePx}px`,
                        lineHeight: 1.2,
                        color: labelColor || '#000',
                      };

                      return (
                        <td
                          key={index}
                          width={`${pct}%`}
                          align="center"
                          style={{
                            width: `${pct}%`,
                            verticalAlign: 'top',
                            padding: 0,
                            textAlign: index === 0 ? 'left' : index === n - 1 ? 'right' : 'center',
                          }}
                        >
                          {title ? <p style={labelStyles}>{title}</p> : null}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    );
  },
};
