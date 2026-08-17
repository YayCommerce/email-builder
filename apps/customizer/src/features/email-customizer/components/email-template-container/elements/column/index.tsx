import { CSSProperties, memo, MouseEventHandler, useCallback, useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import SortableContainer from '@src/features/email-customizer/components/sortable-container';

import { useElementLookupTree } from '@src/features/email-customizer/renewedElementTreeContext';
import { findObjectById } from '@src/features/email-customizer/utils';
import useTemplateContentStore from '@src/stores/templateContent';
import { ComponentChildren } from '@src/types';
import {
  getBorderStyle,
  getDimensionValue,
  getInnerBorderRadiusStyles,
} from '@yaymail/utilities/src/functions';

import { NESTED_COLUMN_CLASS_NAME } from '../../../../constants';
import { IElement } from '../../../../type';
import useResizingStore from '../../resizingStore';

import './index.scss';

export interface IElementColumnProps {
  children?: ComponentChildren;
  columnIndex: number;
  element: IElement<'column'>;
  list: IElement[] | undefined;
  parentId?: string | number;
  style?: CSSProperties;
  width?: number;
}

const ColumnContent = ({
  children,
  columnIndex,
  element,
  parentId,
  list = [],
  width,
}: IElementColumnProps) => {
  const setList = useTemplateContentStore((state) => state.updateList);
  const elementTree = useElementLookupTree();

  const hasChildren = useMemo(() => Boolean(children && list.length > 0), [children, list]);

  // Handle resizing
  const startResizing = useResizingStore((state) => state.startResizing);

  const handleResizeMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      startResizing(e.clientX, columnIndex);
    },
    [columnIndex],
  );

  const parentElement = useMemo(() => {
    return findObjectById(parentId ?? '', elementTree) as IElement<'column_layout'> | null;
  }, [elementTree, parentId]);

  const rowAvgPadding = useMemo(() => {
    return parentElement?.data?.column_spacing ?? 0;
  }, [parentElement]);

  const totalColumns = useMemo(() => {
    return parentElement?.data?.amount_of_columns ?? 0;
  }, [parentElement?.data?.amount_of_columns]);

  const verticalAlign = useMemo(() => {
    return (
      (parentElement?.data as { vertical_align?: 'top' | 'middle' | 'bottom' } | undefined)
        ?.vertical_align ?? 'top'
    );
  }, [parentElement?.data]);

  const borderStyles = useMemo(() => {
    return getBorderStyle(element.data.border);
  }, [element.data.border]);

  const innerBorderRadiusStyles = useMemo(
    () => getInnerBorderRadiusStyles(parentElement, totalColumns, columnIndex),
    [parentElement, totalColumns, columnIndex],
  );

  const style: CSSProperties = useMemo(
    () => ({
      width: width + '%',
      maxWidth: width + '%',
      verticalAlign,
      ...borderStyles,
      ...innerBorderRadiusStyles,
      ...(columnIndex === 0
        ? {
            paddingLeft: '0',
            paddingRight: getDimensionValue(rowAvgPadding / 2),
          }
        : {
            paddingRight: getDimensionValue(rowAvgPadding / 4),
            paddingLeft: getDimensionValue(rowAvgPadding / 4),
          }),
      ...(totalColumns - 1 === columnIndex
        ? {
            paddingRight: '0',
            paddingLeft: getDimensionValue(rowAvgPadding / 2),
          }
        : {}),
    }),
    [
      width,
      totalColumns,
      columnIndex,
      rowAvgPadding,
      verticalAlign,
      borderStyles,
      innerBorderRadiusStyles,
    ],
  );

  return (
    <td style={style} className="yaymail-customizer-element-column">
      {columnIndex > 0 && (
        <div className="yaymail-resize-handle" onMouseDown={handleResizeMouseDown}></div>
      )}
      <SortableContainer
        list={list}
        setList={setList}
        className={NESTED_COLUMN_CLASS_NAME}
        parentList={elementTree}
        parentId={parentId}
        columnIndex={columnIndex}
        style={hasChildren ? { border: 'none' } : ({ minHeight: '50px' } as CSSProperties)}
      >
        {children}
      </SortableContainer>
    </td>
  );
};

const Column = memo(ColumnContent);

export default Column;
