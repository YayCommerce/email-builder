/* eslint-disable no-unused-vars */
import YAYMAIL_TOKENS from '@src/constants/tokens';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import useTemplateContentStore from '@src/stores/templateContent';
import { debug, roundUpToTwoDecimalNumbers } from '@src/utils';
import { __ } from '@wordpress/i18n';
import { setAutoFreeze } from 'immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { IElement } from '../../type';

setAutoFreeze(false);

export interface IResizingState {
  isResizing: boolean;
  startX: number | null;
  rightColumnIndex: number | null;
  resizingColumns: IElement['children'] | null;
  startResizing: (x: number, rightIndex: number) => void;
  stopResizing: () => void;
  resize: (clientX: number) => void;
}

export const COLUMN_MIN_WIDTH_PERCENT = YAYMAIL_TOKENS.customizer.percentColumnMinWidth;

const useResizingStore = createWithEqualityFn<IResizingState>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        isResizing: false,
        startX: null,
        rightColumnIndex: null,
        resizingColumns: null,
        startResizing: (x, rightIndex) =>
          set((state) => {
            state.isResizing = true;
            state.startX = x;
            state.rightColumnIndex = rightIndex;
            state.resizingColumns = useTemplateContentStore.getState().chosenElement?.children;
          }),
        stopResizing: () =>
          set((state) => {
            state.isResizing = false;
            state.startX = null;
            state.rightColumnIndex = null;
            state.resizingColumns = null;
          }),
        resize: (clientX) => {
          set((state) => {
            if (
              !state.resizingColumns ||
              !state.startX ||
              !state.rightColumnIndex ||
              state.rightColumnIndex <= 0 ||
              state.rightColumnIndex >= state.resizingColumns.length
            ) {
              // debug('Error trying to resize columns');
              return;
            }

            const columnMaxWidth = 100 - (state.resizingColumns.length - 1) * 5;
            // Calculate the distance the mouse has moved horizontally
            const distanceX = clientX - state.startX;

            // Get the left and right columns
            const leftColumn = state.resizingColumns[state.rightColumnIndex - 1]?.data as {
              width: number;
            };
            const rightColumn = state.resizingColumns[state.rightColumnIndex]?.data as {
              width: number;
            };

            const leftColumnWidth = leftColumn?.width ?? COLUMN_MIN_WIDTH_PERCENT;
            const rightColumnWidth = rightColumn?.width ?? COLUMN_MIN_WIDTH_PERCENT;
            const containerWidth = Number(
              useCustomizerSettingsStore.getState().settings?.container_width,
            );
            // Calculate the percentage change
            // -10px to cover possible margins and borders
            let percentageChange = (distanceX / (containerWidth - 10)) * 100;
            percentageChange = roundUpToTwoDecimalNumbers(percentageChange);

            const newLeftColumnWidth = Math.min(
              columnMaxWidth,
              Math.max(COLUMN_MIN_WIDTH_PERCENT, leftColumnWidth + percentageChange),
            );

            const newRightColumnWidth = Math.min(
              columnMaxWidth,
              Math.max(COLUMN_MIN_WIDTH_PERCENT, rightColumnWidth - percentageChange),
            );

            if (
              newLeftColumnWidth <= COLUMN_MIN_WIDTH_PERCENT ||
              newRightColumnWidth <= COLUMN_MIN_WIDTH_PERCENT
            ) {
              return;
            }

            useTemplateContentStore.getState().updateChosenElementChildren(
              (children) => {
                if (!children) return;
                (children[state.rightColumnIndex! - 1].data as any).width =
                  roundUpToTwoDecimalNumbers(newLeftColumnWidth);
                (children[state.rightColumnIndex!].data! as any).width =
                  roundUpToTwoDecimalNumbers(newRightColumnWidth);
              },
              { attribute: __('Width', 'yaymail') },
            );
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default useResizingStore;
