/* eslint-disable no-unused-vars */
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

interface IMigrationStore {
  isCriticalMigrationRequired: boolean;

  setIsCriticalMigrationRequired: (isCriticalMigrationRequired: boolean) => void;
}

const useMigrationStore = createWithEqualityFn<IMigrationStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        isCriticalMigrationRequired: window.yaymailData.is_critical_migration_required,
        setIsCriticalMigrationRequired: (isCriticalMigrationRequired) => {
          set((state) => {
            state.isCriticalMigrationRequired = isCriticalMigrationRequired;
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default useMigrationStore;
