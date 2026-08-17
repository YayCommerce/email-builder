/* eslint-disable no-unused-vars */
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useImageListStore = createWithEqualityFn<{
  selectedColumn: null | number;
  selectColumn: (v: any) => void;
}>()(
  subscribeWithSelector(
    devtools(
      immer((set) => ({
        selectedColumn: null,
        selectedElement: null,
        selectColumn: (v) => {
          set((state) => {
            state.selectedColumn = v;
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);
