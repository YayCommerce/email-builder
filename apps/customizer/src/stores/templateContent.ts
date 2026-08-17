/* eslint-disable no-unused-vars */
import { IElement } from '@src/features/email-customizer/';
import {
  deleteObjectByIds,
  duplicateObjectByIds,
  findAndReplaceElement,
  findParentColumnLayout,
  getStylesData,
  pasteObjectById,
} from '@src/features/email-customizer/utils';
import { arrayMoveImmutable } from 'array-move';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import {
  debouncePushChangeToHistory,
  IChangeInfo,
  pushChangeToHistory,
} from './templateContentHistory';
import { __ } from '@wordpress/i18n';

type UpdateChosenElementDataCallback = (data: IElement['data']) => void;
type UpdateChosenElementChildrenCallback = (children: IElement['children']) => void;
type NavigatingPathType = string | null;
type SpecialEditorScreenType = {
  key: string;
  title: string;
};
export interface IEmailCustomizerState {
  list: IElement[];
  chosenElement: IElement | null;
  copiedElement: IElement | null;
  copiedStylesElement: IElement | null;
  hasChanged: boolean;
  isDiscardChangesConfirmModalDisplayed: boolean;
  navigatingPath: NavigatingPathType; // This is being used to navigate to after user select "Save" on Discard Confirm Modal
  multiSelectedList: Array<IElement>;
  lastChosenElement: IElement | null;
  specialEditorScreen: SpecialEditorScreenType | null;
  setSpecialEditorScreen: (screenData: SpecialEditorScreenType | null) => void;
  updateList: (list: IElement[], changeInfo?: IChangeInfo | null) => void;
  chooseElement: (element: IElement) => void;
  unchooseElement: () => void;
  deMultiSelect: () => void;
  updateChosenElementData: (
    fn: UpdateChosenElementDataCallback,
    changingInfo: Pick<IChangeInfo, 'attribute'>,
  ) => void;
  updateChosenElementChildren: (
    fn: UpdateChosenElementChildrenCallback,
    changingInfo: Pick<IChangeInfo, 'attribute'>,
  ) => void;
  swapWithPreviousElement: (elementId: string | number) => void;
  swapWithNextElement: (elementId: string | number) => void;
  swapGroupWithPreviousElement: (group: IElement[]) => void;
  swapGroupWithNextElement: (group: IElement[]) => void;
  duplicateElement: () => void;
  copyElement: (element: IElement) => void;
  pasteElement: () => void;
  copyStylesElement: (sourceElement?: IElement | null) => void;
  pasteStylesElement: (targetElement?: IElement | null) => void;
  removeElements: (elementIds: IElement['id'][]) => void;
  removeAllElements: (excludedTypes?: IElement['type'][]) => void;
  changeContentStatus: (status: boolean) => void;
  changeListBackgroundColor: (color: string) => void;
  changeListTextColor: (color: string) => void;
  changeListTitleColor: (color: string) => void;
  displayDiscardChangesConfirmModal: (path: NavigatingPathType) => void;
  hideDiscardChangesConfirmModal: () => void;
  clearNavigatingPath: () => void;
  selectParentColumnElement: (parentId: IElement['parentId']) => void;
  multiSelect: (element: IElement, isShiftKey?: boolean) => void;
  setMultiSelectedList: (list: Array<IElement>) => void;
  removeElementFromMultiSelectedList: (elementId: IElement['id']) => void;
}

const useTemplateContentStore = createWithEqualityFn<IEmailCustomizerState>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        list: [],
        chosenElement: null,
        copiedElement: null,
        copiedStylesElement: null,
        hasChanged: false,
        isDiscardChangesConfirmModalDisplayed: false,
        navigatingPath: null,
        multiSelectedList: [],
        lastChosenElement: null,
        specialEditorScreen: null,
        setSpecialEditorScreen: (screenKey) => {
          set((state) => {
            state.specialEditorScreen = screenKey;
          });
        },
        updateList: (list, changeInfo) => {
          set((state) => {
            state.list = list;
          });
          if (changeInfo != null) {
            pushChangeToHistory(changeInfo);
          }
        },
        chooseElement: (element) =>
          set((state) => {
            state.chosenElement = element;

            let newLastChosenElement: IElement | null = element;
            if (element.parentId) {
              newLastChosenElement = findParentColumnLayout(element.parentId, get().list);
            }

            state.lastChosenElement = newLastChosenElement;
          }),
        deMultiSelect: () =>
          set((state) => {
            state.multiSelectedList = [];
            state.lastChosenElement = null;
          }),
        unchooseElement: () => set(() => ({ chosenElement: null })),
        changeContentStatus: (status) => set(() => ({ hasChanged: status })),
        updateChosenElementData: (fn, changingInfo) => {
          set((state) => {
            fn(state.chosenElement?.data ?? ({} as IElement['data']));
          });

          // Update multiselect list data
          const chosenElement = get().chosenElement;
          if (chosenElement?.virtual) {
            let rootList = structuredClone(get().list);
            let multiSelectedList = structuredClone(get().multiSelectedList);
            multiSelectedList.forEach((item) => {
              fn(item?.data ?? ({} as IElement['data']));
              const newItemData = { ...item.data };
              const index = rootList.findIndex((i) => i.id === item.id);
              rootList[index].data = newItemData;
              item.data = newItemData;
            });
            set((state) => {
              state.multiSelectedList = multiSelectedList;
              state.list = rootList;
            });
          }

          if (changingInfo.attribute != undefined) {
            debouncePushChangeToHistory({
              ...changingInfo,
              action: 'edited',
              elementName: get().chosenElement?.name ?? '',
            });
          }
        },
        updateChosenElementChildren: (fn, changingInfo) => {
          set((state) => {
            fn(state.chosenElement?.children);
          });
          debouncePushChangeToHistory({
            ...changingInfo,
            action: 'edited',
            elementName: get().chosenElement?.name ?? '',
          });
        },
        swapWithPreviousElement: (elementId) => {
          const currentList = get().list;
          const index = currentList.findIndex((obj) => obj.id === elementId);
          if (index > 0 && index < currentList.length) {
            const swappedList = arrayMoveImmutable(currentList, index, index - 1);
            set(() => ({ list: swappedList }));

            pushChangeToHistory({
              action: 'moved',
              elementName: get().chosenElement?.name ?? '',
            });
          }
        },
        swapWithNextElement: (elementId) => {
          const currentList = get().list;
          const index = currentList.findIndex((obj) => obj.id === elementId);
          if (index >= 0 && index < currentList.length - 1) {
            const swappedList = arrayMoveImmutable(currentList, index, index + 1);
            set(() => ({ list: swappedList }));

            pushChangeToHistory({
              action: 'moved',
              elementName: get().chosenElement?.name ?? '',
            });
          }
        },
        swapGroupWithPreviousElement: (group) => {
          const currentList = get().list;
          const index = currentList.findIndex((obj) => obj.id === group[0].id);
          if (index > 0 && index < currentList.length) {
            let swappedList = currentList;
            group.forEach((groupItem) => {
              const indexInCurrentList = currentList.findIndex((obj) => obj.id === groupItem.id);
              swappedList = arrayMoveImmutable(
                swappedList,
                indexInCurrentList,
                indexInCurrentList - 1,
              );
            });
            set(() => ({ list: swappedList }));

            pushChangeToHistory({
              action: 'moved',
              elementName: __('Group', 'yaymail'),
            });
          }
        },
        swapGroupWithNextElement: (group) => {
          const currentList = get().list;
          const index = currentList.findIndex((obj) => obj.id === group[0].id);
          if (index >= 0 && index < currentList.length - 1) {
            let swappedList = currentList;
            (group as any).toReversed().forEach((groupItem: IElement) => {
              const indexInCurrentList = currentList.findIndex((obj) => obj.id === groupItem.id);
              swappedList = arrayMoveImmutable(
                swappedList,
                indexInCurrentList,
                indexInCurrentList + 1,
              );
            });
            set(() => ({ list: swappedList }));

            pushChangeToHistory({
              action: 'moved',
              elementName: __('Group', 'yaymail'),
            });
          }
        },
        duplicateElement: () => {
          const originalElement = get().chosenElement;
          const multipleSelectList = get().multiSelectedList;
          const isPatternSelected = multipleSelectList.length > 1; // Pattern considered as selected when there is more than 1 element in list
          let ids: any[] = [];
          if (isPatternSelected) {
            ids = multipleSelectList.map((i) => i.id);
          } else {
            ids = originalElement?.id ? [originalElement.id] : [];
          }
          if (ids.length < 1) return;
          const cloneList = duplicateObjectByIds(ids, get().list);
          // if (isDuplicationSucceeded) {
          set((state) => {
            state.list = cloneList;
          });

          pushChangeToHistory({
            action: 'duplicated',
            elementName: isPatternSelected ? 'Pattern' : originalElement?.name ?? 'Element',
          });
        },
        copyElement: (element) => set(() => ({ copiedElement: element })),
        pasteElement: () => {
          const originalElement = get().chosenElement;
          const copiedElement = get().copiedElement;
          if (!originalElement || !copiedElement || !originalElement.id || !copiedElement.id)
            return;

          const cloneList = structuredClone(get().list);
          const isPastedElementSucceeded = pasteObjectById(
            originalElement?.id,
            cloneList,
            copiedElement,
          );
          if (isPastedElementSucceeded) {
            set((state) => {
              state.list = cloneList;
            });

            pushChangeToHistory({ action: 'pasted', elementName: copiedElement.name });
          }
        },
        copyStylesElement: (sourceElement) => {
          const chosenElement = structuredClone(sourceElement ?? get().chosenElement);
          if (chosenElement === null) return;
          const copiedElement = { ...chosenElement };
          // Special element
          if (
            copiedElement.type === 'image_box' ||
            copiedElement.type === 'image_list' ||
            copiedElement.type === 'text_list'
          ) {
            const copiedStylesElement = Object.entries(copiedElement.data).map(
              ([key, value]: [string, any]) => {
                if (key === 'image_box' || key === 'image_list' || key === 'text_list') {
                  const nestedAttrs = value?.default_value ?? value;
                  if (nestedAttrs.column_1) {
                    nestedAttrs.column_1 = getStylesData(key, nestedAttrs.column_1);
                  }
                  if (nestedAttrs.column_2) {
                    nestedAttrs.column_2 = getStylesData(key, nestedAttrs.column_2);
                  }
                  if (nestedAttrs.column_3) {
                    nestedAttrs.column_3 = getStylesData(key, nestedAttrs.column_3);
                  }
                  return [key, nestedAttrs];
                }
                return [key, value?.default_value ?? value];
              },
            );
            copiedElement.data = Object.fromEntries(copiedStylesElement);
          } else if (copiedElement.type === 'order_progress') {
            const copiedStylesElement = Object.entries(copiedElement.data).map(
              ([key, value]: [string, any]) => {
                if (key === 'steps') {
                  const nestedAttrs = value?.default_value ?? value;
                  const newAttrs: any[] = [];
                  nestedAttrs.forEach(
                    ({
                      image_bg_color,
                      icon_border_color,
                      icon_border_style,
                      icon_border_width,
                    }: any) => {
                      newAttrs.push({
                        image_bg_color,
                        icon_border_color,
                        icon_border_style,
                        icon_border_width,
                      });
                    },
                  );
                  return [key, newAttrs];
                }
                return [key, value?.default_value ?? value];
              },
            );
            copiedElement.data = Object.fromEntries(copiedStylesElement);
          } else {
            copiedElement.data = getStylesData(copiedElement.type, copiedElement.data) as any;
          }
          set((state) => {
            state.copiedStylesElement = copiedElement;
          });
        },
        pasteStylesElement: (targetElement) => {
          const chosenElement = structuredClone(targetElement ?? get().chosenElement) as any;
          const copiedStylesElement = structuredClone(get().copiedStylesElement) as any;

          if (copiedStylesElement === null || chosenElement == null) return;
          if (
            copiedStylesElement.type === 'image_box' ||
            copiedStylesElement.type === 'image_list' ||
            copiedStylesElement.type === 'text_list'
          ) {
            if (copiedStylesElement.data.number_column) {
              delete copiedStylesElement.data.number_column; // Not pasted number_column
            }
            if (copiedStylesElement.data[copiedStylesElement.type].column_1) {
              copiedStylesElement.data[copiedStylesElement.type].column_1 = {
                ...chosenElement.data[copiedStylesElement.type].column_1,
                ...copiedStylesElement.data[copiedStylesElement.type].column_1,
              };
            }
            if (copiedStylesElement.data[copiedStylesElement.type].column_2) {
              copiedStylesElement.data[copiedStylesElement.type].column_2 = {
                ...chosenElement.data[copiedStylesElement.type].column_2,
                ...copiedStylesElement.data[copiedStylesElement.type].column_2,
              };
            }
            if (copiedStylesElement.data[copiedStylesElement.type].column_3) {
              copiedStylesElement.data[copiedStylesElement.type].column_3 = {
                ...chosenElement.data[copiedStylesElement.type].column_3,
                ...copiedStylesElement.data[copiedStylesElement.type].column_3,
              };
            }
          }
          if (copiedStylesElement.type === 'order_progress') {
            copiedStylesElement.data.steps = chosenElement.data.steps.map(
              (step: any, stepIndex: number) => {
                if (copiedStylesElement.data.steps?.[stepIndex] == null) {
                  return step;
                }
                return {
                  ...step,
                  ...copiedStylesElement.data.steps[stepIndex],
                };
              },
            );
          }
          set((state) => {
            const mergedData = { ...chosenElement.data, ...copiedStylesElement.data };
            const updatedElement = { ...chosenElement, data: mergedData };
            const cloneList = structuredClone(state.list);
            findAndReplaceElement(cloneList, chosenElement.id, updatedElement);
            state.list = cloneList;

            if (state.chosenElement && state.chosenElement.id === chosenElement.id) {
              state.chosenElement.data = mergedData;
            }
          });
          pushChangeToHistory({ action: 'pasted_styles', elementName: copiedStylesElement.name });
        },
        removeElements: (elementIds) => {
          if (!elementIds) return;
          const cloneList = deleteObjectByIds(elementIds, get().list);
          set((state) => {
            state.list = cloneList;
          });
          get().deMultiSelect();
          pushChangeToHistory({
            action: 'removed',
            elementName: get().chosenElement?.name ?? '',
          });

          get().unchooseElement();
        },
        removeAllElements: (excludedTypes) => {
          if (excludedTypes) {
            set((state) => {
              state.list = get().list.filter((element) => excludedTypes.includes(element.type));
            });
          } else {
            set((state) => {
              state.list = [];
            });
          }

          pushChangeToHistory({
            action: 'removed',
            elementName: 'All Elements',
          });

          get().unchooseElement();
        },
        changeListBackgroundColor: (color: string) => {
          set((state) => {
            state.list.forEach((element) => {
              if ((element.data as any).background_color) {
                (element.data as any).background_color = color;
              }
            });
            debouncePushChangeToHistory({
              elementName: 'Content background',
              action: 'edited',
            });
          });
        },
        changeListTextColor: (color: string) => {
          set((state) => {
            state.list.forEach((element) => {
              if ((element.data as any).text_color) {
                (element.data as any).text_color = color;
              }
            });
          });
          debouncePushChangeToHistory({
            elementName: 'Content text color',
            action: 'edited',
          });
        },
        changeListTitleColor: (color: string) => {
          set((state) => {
            state.list.forEach((element) => {
              if ((element.data as any).title_color) {
                (element.data as any).title_color = color;
              }
            });
            debouncePushChangeToHistory({
              elementName: 'Title',
              action: 'edited',
            });
          });
        },
        clearNavigatingPath: () => {
          set((state) => {
            state.navigatingPath = null;
          });
        },

        displayDiscardChangesConfirmModal: (path) => {
          set((state) => {
            state.isDiscardChangesConfirmModalDisplayed = true;
            state.navigatingPath = path;
          });
        },

        hideDiscardChangesConfirmModal: () => {
          set((state) => {
            state.isDiscardChangesConfirmModalDisplayed = false;
            state.navigatingPath = null;
          });
        },

        selectParentColumnElement: (parentId) => {
          if (!parentId) return;
          const parentColumnLayout = findParentColumnLayout(parentId, get().list);

          if (parentColumnLayout) {
            set((state) => {
              state.chosenElement = parentColumnLayout;
            });
          }
        },

        multiSelect: (element, isShiftKey = false) => {
          const list = get().list;
          let newSelectedList: IElement[] = [];

          if (isShiftKey) {
            const elementId = element.id;

            let chosenElementIndex = -1;
            let selectedIndex = -1;
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === get().lastChosenElement?.id) chosenElementIndex = i;
              if (list[i].id === elementId) selectedIndex = i;

              if (chosenElementIndex !== -1 && selectedIndex !== -1) break;
            }

            if (chosenElementIndex === -1 || selectedIndex === -1) return;

            const fromIndex = Math.min(chosenElementIndex, selectedIndex);
            const toIndex = Math.max(chosenElementIndex, selectedIndex);

            newSelectedList = list.slice(fromIndex, toIndex + 1);
          } else {
            const currentMultiSelectedList = get().multiSelectedList;
            newSelectedList = [...currentMultiSelectedList, element];
            // sort newSelectedList by position
            newSelectedList.sort((a, b) => {
              const aPosition = list.findIndex((i) => i.id === a.id);
              const bPosition = list.findIndex((i) => i.id === b.id);
              return aPosition - bPosition;
            });
          }
          let commonProperties: string[] = [];
          newSelectedList.forEach((element, index) => {
            const elementData = Object.keys(element.data);
            if (index === 0) {
              const stylesData = getStylesData(element.type, element.data);
              commonProperties = Object.keys(stylesData);
            } else {
              commonProperties = commonProperties.filter((item: string) =>
                elementData.includes(item),
              );
            }
          });
          // create virtual element
          const virtualElement = {
            ...newSelectedList[0],
            id: `virtual-${newSelectedList[0].id}`,
            name: __('Multi Selected Elements', 'yaymail'),
            data: {
              ...commonProperties.reduce((acc, key) => {
                acc[key] = (newSelectedList[0].data as any)[key];
                return acc;
              }, {} as Record<string, any>),
            },
            virtual: true,
          };

          set((state) => {
            state.multiSelectedList = newSelectedList.find((i) => i.type === 'skeleton_divider')
              ? []
              : newSelectedList;
            state.chosenElement = virtualElement as any;
          });
        },
        setMultiSelectedList: (list) => {
          set((state) => {
            state.multiSelectedList = list;
          });
        },
        removeElementFromMultiSelectedList: (elementId) => {
          const multiSelectedList = get().multiSelectedList;
          const newMultiSelectedList = multiSelectedList.filter((i) => i.id !== elementId);
          if (newMultiSelectedList.length === 1) {
            set((state) => {
              state.chosenElement = newMultiSelectedList[0];
            });
          } else {
            let commonProperties: string[] = [];
            newMultiSelectedList.forEach((element, index) => {
              const elementData = Object.keys(element.data);
              if (index === 0) {
                const stylesData = getStylesData(element.type, element.data);
                commonProperties = Object.keys(stylesData);
              } else {
                commonProperties = commonProperties.filter((item: string) =>
                  elementData.includes(item),
                );
              }
            });
            set((state) => {
              state.chosenElement = {
                ...newMultiSelectedList[0],
                id: `virtual-${newMultiSelectedList[0].id}`,
                name: __('Multi Selected Elements', 'yaymail'),
                data: {
                  ...commonProperties.reduce((acc, key) => {
                    acc[key] = (newMultiSelectedList[0].data as any)[key];
                    return acc;
                  }, {} as Record<string, any>),
                },
                virtual: true,
              } as any;
            });
          }
          set((state) => {
            state.multiSelectedList = newMultiSelectedList;
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default useTemplateContentStore;
