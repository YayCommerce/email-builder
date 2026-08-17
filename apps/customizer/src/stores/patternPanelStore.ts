/* eslint-disable no-unused-vars */
import { ArrayElementType } from '@src/features/email-customizer/type';
import { setAutoFreeze } from 'immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

setAutoFreeze(false);

export interface IPatternPanelStore {
  activeTab: 'patterns' | 'library';
  isOpen: boolean;
  currentSectionTemplate: ArrayElementType<typeof window.yaymailData.builder.section_templates>;

  setCurrentSectionTemplate: (
    currentSectionTemplate: ArrayElementType<typeof window.yaymailData.builder.section_templates>,
  ) => void;
  openPanel: () => void;
  closePanel: () => void;
  openSectionTemplate: (sectionKey: string) => boolean;
  setActiveTab: (activeTab: 'patterns' | 'library') => void;
}

const usePatternPanelStore = createWithEqualityFn<IPatternPanelStore>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        activeTab: 'patterns',
        isOpen: false,
        currentSectionTemplate: {} as any,
        openPanel: () =>
          set((state) => {
            state.isOpen = true;
          }),
        closePanel: () =>
          set((state) => {
            state.isOpen = false;
          }),

        openSectionTemplate: (sectionKey) => {
          const sectionTemplates = Object.values(window.yaymailData.builder.section_templates);
          const section = sectionTemplates.find((template) => String(template.type) === sectionKey);

          if (!section) {
            return false;
          }

          set((state) => {
            state.isOpen = true;
            state.currentSectionTemplate = section as IPatternPanelStore['currentSectionTemplate'];
            state.activeTab = 'patterns';
          });

          return true;
        },

        setCurrentSectionTemplate: (currentSectionTemplate) =>
          set((state) => {
            state.currentSectionTemplate = currentSectionTemplate;
          }),
        setActiveTab: (activeTab) =>
          set((state) => {
            state.activeTab = activeTab;
          }),
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default usePatternPanelStore;
