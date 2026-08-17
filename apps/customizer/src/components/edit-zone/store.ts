import { createWithEqualityFn } from 'zustand/traditional';

import { ActiveEditZone } from './types';

type SaveCallback = (() => void) | null;

interface IEditZoneState {
  activeZone: ActiveEditZone | null;
  /** Registered by the currently editing zone so enterEditMode can flush previous */
  saveActiveZone: SaveCallback;
  registerSaveCallback: (cb: SaveCallback) => void;
  enterEditMode: (zone: ActiveEditZone) => void;
  exitEditMode: () => void;
}

const useEditZoneStore = createWithEqualityFn<IEditZoneState>((set, get) => ({
  activeZone: null,
  saveActiveZone: null,
  registerSaveCallback: (cb) => set({ saveActiveZone: cb }),
  enterEditMode: (zone) => {
    const { activeZone, saveActiveZone } = get();
    if (
      activeZone &&
      (activeZone.elementId !== zone.elementId || activeZone.valuePath !== zone.valuePath)
    ) {
      saveActiveZone?.();
    }
    set({ activeZone: zone });
  },
  exitEditMode: () => set({ activeZone: null, saveActiveZone: null }),
}));

export default useEditZoneStore;
