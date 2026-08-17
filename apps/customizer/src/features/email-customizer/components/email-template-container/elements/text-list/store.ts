import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const useTextListStore = createWithEqualityFn<{
  selectedColumn: null | number;
  selectedElement: null | number;
  selectColumn: (v: any) => void;
  selectElement: (v: any) => void;
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
        selectElement: (v) => {
          set((state) => {
            state.selectedElement = v;
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);
