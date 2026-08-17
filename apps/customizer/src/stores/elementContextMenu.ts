import { IElement } from '@src/features/email-customizer/';
import { createWithEqualityFn } from 'zustand/traditional';

export type ElementContextMenuPosition = { x: number; y: number };

export type OpenContextMenuParams = ElementContextMenuPosition & {
  menuTargetElementId?: IElement['id'];
  useMultiSelect?: boolean;
};

interface IElementContextMenuState {
  position: ElementContextMenuPosition | null;
  menuTargetElementId: IElement['id'] | null;
  useMultiSelect: boolean;
  openContextMenu: (params: OpenContextMenuParams) => void;
  closeContextMenu: () => void;
}

const useElementContextMenuStore = createWithEqualityFn<IElementContextMenuState>((set) => ({
  position: null,
  menuTargetElementId: null,
  useMultiSelect: false,
  openContextMenu: ({ x, y, menuTargetElementId, useMultiSelect = false }) =>
    set({
      position: { x, y },
      menuTargetElementId: menuTargetElementId ?? null,
      useMultiSelect,
    }),
  closeContextMenu: () =>
    set({
      position: null,
      menuTargetElementId: null,
      useMultiSelect: false,
    }),
}));

export default useElementContextMenuStore;
