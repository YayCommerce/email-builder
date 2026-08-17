/* eslint-disable no-unused-vars */
import { IElement } from '@src/features/email-customizer';
import { findObjectById } from '@src/features/email-customizer/utils';
import { isDefined } from '@yaymail/utilities/src/functions';
import debounce from 'lodash.debounce';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import useTemplateContentStore from './templateContent';

export interface IChangeInfo {
  attribute?: string;
  action:
    | 'edited'
    | 'moved'
    | 'removed'
    | 'added'
    | 'duplicated'
    | 'copied'
    | 'pasted'
    | 'pasted_styles'
    | 'initialized';
  elementName?: string;
  customMessage?: string;
}

export interface IChangeItem {
  data: Array<IElement>;
  info: IChangeInfo | null;
}

export interface ITemplateContentHistoryStates {
  hasUndo: boolean;
  hasRedo: boolean;
  changes: Array<IChangeItem>;
  timeTravelingIndex: number | null;
  isAfterUndoRedo: boolean;
}

export const pushChangeToHistory = (changeInfo: IChangeInfo | null | undefined) => {
  useTemplateContentHistoryStore
    .getState()
    .pushNewChange(useTemplateContentStore.getState().list, changeInfo);
};

export const debouncePushChangeToHistory = debounce(pushChangeToHistory, 200);

export interface ITemplateContentHistoryActions {
  pushNewChange: (data: IElement[], changingInfo?: IChangeItem['info']) => void;
  setTimeTravelingIndex: (index: number | null) => void;
  setHasUndo: (value: boolean) => void;
  setHasRedo: (value: boolean) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  setIsAfterUndoRedo: (value: boolean) => void;
  jumpToChange: (changeIndex: number) => void;
}
const CHANGES_LIMIT = 50;
const initialState: ITemplateContentHistoryStates = {
  hasUndo: false,
  hasRedo: false,
  changes: [],
  timeTravelingIndex: 0,
  isAfterUndoRedo: false,
};

const useTemplateContentHistoryStore = createWithEqualityFn<
  ITemplateContentHistoryStates & ITemplateContentHistoryActions
>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        ...initialState,

        pushNewChange: (changingData, changingInfo) => {
          if (get().isAfterUndoRedo) return;
          if (changingInfo == null) return;

          set((state) => {
            const newChange = {
              data: changingData,
              info: changingInfo ?? null,
            };

            // Remove changes beyond the limit
            if (state.changes.length >= CHANGES_LIMIT) {
              state.changes.splice(1, 1);
            }

            // Check if we're time traveling and remove changes that are ahead of current index
            if (
              state.timeTravelingIndex !== null &&
              state.timeTravelingIndex < state.changes.length - 1
            ) {
              state.changes.splice(state.timeTravelingIndex + 1);
            }

            if (newChange.info.action === 'initialized') {
              if (get().changes.every((change) => change.info?.action === 'initialized')) {
                // Remove initial changes when useEffect initialized
                state.changes = [];
              } else if (get().changes.length > 0) {
                // Because we don't clear history when saving template, we don't want to add new initialized change
                return;
              }
            }

            state.changes.push(newChange);
            state.timeTravelingIndex = state.changes.length - 1;
          });
        },
        setTimeTravelingIndex: (newIndex) => {
          set((state) => {
            state.timeTravelingIndex = newIndex;
          });
        },
        setHasUndo: (value) => {
          set((state) => {
            state.hasUndo = value;
          });
        },
        setHasRedo: (value) => {
          set((state) => {
            state.hasRedo = value;
          });
        },
        undo: () => {
          if (get().timeTravelingIndex === null) return;
          if (get().timeTravelingIndex! > 0) {
            set((state) => {
              state.timeTravelingIndex!--;
              state.isAfterUndoRedo = true;
            });
          }
        },
        redo: () => {
          if (get().timeTravelingIndex === null) return;
          if (get().timeTravelingIndex! < get().changes.length - 1) {
            set((state) => {
              state.timeTravelingIndex!++;
              state.isAfterUndoRedo = true;
            });
          }
        },
        setIsAfterUndoRedo: (value) => {
          set((state) => {
            state.isAfterUndoRedo = value;
          });
        },
        jumpToChange: (index) => {
          set((state) => {
            state.timeTravelingIndex = index;
            state.isAfterUndoRedo = true;
          });
        },

        reset: () => {
          set(initialState);
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default useTemplateContentHistoryStore;

useTemplateContentHistoryStore.subscribe(
  (state) => state.timeTravelingIndex,
  (index) => {
    const changes = useTemplateContentHistoryStore.getState().changes;

    // Update Undo/Redo states
    useTemplateContentHistoryStore.getState().setHasUndo(Boolean(index));
    useTemplateContentHistoryStore
      .getState()
      .setHasRedo(Boolean(index !== null && index < changes.length - 1));

    // Perform time travel
    if (
      index !== null &&
      changes[index] &&
      useTemplateContentHistoryStore.getState().isAfterUndoRedo
    ) {
      const newList = changes[index].data;
      useTemplateContentStore.getState().updateList(newList, null);
      useTemplateContentHistoryStore.getState().setIsAfterUndoRedo(false);

      // Update chosen element if it still exists, else unchoose element
      const chosenElementId = useTemplateContentStore.getState().chosenElement?.id;
      if (!isDefined(chosenElementId)) return; // chosenElement doesn't exist, no further action needed

      const updatedChosenElement = findObjectById(chosenElementId, newList);

      if (!updatedChosenElement) useTemplateContentStore.getState().unchooseElement();
      else {
        useTemplateContentStore.getState().chooseElement(updatedChosenElement);
      }
    }
  },
);
