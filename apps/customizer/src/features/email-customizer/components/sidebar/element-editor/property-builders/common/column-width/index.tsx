import { useCallback, useMemo } from 'react';

import { Space } from 'antd';

import YAYMAIL_TOKENS from '@src/constants/tokens';
// eslint-disable-next-line no-restricted-imports
import { IElement } from '@src/features/email-customizer/type';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';
import NumberInputBase from '../../base/number-input-base';
import { ColumnWidthType } from './type';

import './index.scss';

const PERCENT_COLUMN_MIN_WIDTH = YAYMAIL_TOKENS.customizer.percentColumnMinWidth;

const getNeighborIndexes = (array: Array<any>, index: number) => {
  const length = array.length;

  if (length <= 1) {
    return [];
  }

  if (index === 0) {
    return [index + 1];
  }

  if (index === length - 1) {
    return [index - 1];
  }

  return [index - 1, index + 1];
};

const ColumnWidth: PropertyBuilderComponentType<ColumnWidthType> = (props?) => {
  const { title, amount } = props || {};
  if (amount === 1) return null;
  const widths =
    useTemplateContentStore((state) =>
      state.chosenElement?.children?.map((child) => (child.data as any).width),
    ) ?? [];

  const updateChosenElementChildren = useTemplateContentStore(
    (state) => state.updateChosenElementChildren,
  );

  const getLabel = useCallback((index: number) => `${__('Column', 'yaymail')} ${index + 1}`, []);

  const handleOnChange = useCallback(
    (value: number, index: number) => {
      updateChosenElementChildren(
        (children: IElement['children']) => {
          if (!children) return;
          const neighborIndexes = getNeighborIndexes(children, index);

          const totalNeighborColumnsWidth = children.reduce((totalWidth, child, i) => {
            if ([...neighborIndexes, index].includes(i)) {
              return totalWidth + ((child.data as any).width ?? 0);
            }
            return totalWidth;
          }, 0);

          if (neighborIndexes.length === 0) return;

          const currentColumnMaxWidth =
            totalNeighborColumnsWidth - neighborIndexes.length * PERCENT_COLUMN_MIN_WIDTH;

          if (currentColumnMaxWidth < PERCENT_COLUMN_MIN_WIDTH) return;

          const newWidth = Math.min(
            currentColumnMaxWidth,
            Math.max(PERCENT_COLUMN_MIN_WIDTH, value),
          );

          const currentColumnOldWidth = (children[index].data as any).width;

          const percentChange = newWidth - currentColumnOldWidth;

          const percentChangeOnNeighbors = percentChange / neighborIndexes.length;

          const neighborColumnNewWidths = neighborIndexes.map((neighborIndex) => ({
            index: neighborIndex,
            width: (children[neighborIndex].data as any).width - percentChangeOnNeighbors,
          }));

          if (neighborColumnNewWidths.length === 2) {
            neighborColumnNewWidths.forEach((neighborColumn) => {
              if (neighborColumn.width < PERCENT_COLUMN_MIN_WIDTH) {
                const diff = PERCENT_COLUMN_MIN_WIDTH - neighborColumn.width;
                neighborColumn.width = PERCENT_COLUMN_MIN_WIDTH;
                const otherNeighbor = neighborColumnNewWidths.find(
                  (other) => other.index !== neighborColumn.index,
                );
                if (otherNeighbor) {
                  otherNeighbor.width -= diff;
                }
              }
            });
          }

          if (neighborColumnNewWidths.every((e) => e.width < PERCENT_COLUMN_MIN_WIDTH)) return;

          neighborColumnNewWidths.forEach((e) => {
            (children[e.index].data as any).width = e.width;
          });

          (children[index].data as any).width = newWidth;
        },
        { attribute: __('Width', 'yaymail') },
      );
    },
    [updateChosenElementChildren],
  );

  const maxWidth = useMemo(
    () => 100 - ((props?.amount || 1) - 1) * PERCENT_COLUMN_MIN_WIDTH,
    [props?.amount],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-column-width">
      <div className="yaymail-title">{title}</div>
      <Space className="yaymail-controls-container">
        {widths.map((width, index) => (
          <NumberInputBase
            label={getLabel(index)}
            value={width}
            onChange={(value) => handleOnChange(value, index)}
            max={maxWidth}
            key={index}
          />
        ))}
      </Space>
    </div>
  );
};

export default ColumnWidth;
