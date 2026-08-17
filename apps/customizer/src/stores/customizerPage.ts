/* eslint-disable no-unused-vars */
import { IGlobalVariables } from '@src/features/dashboard-settings/components/global-variables/type';
import { DEFAULT_GLOBAL_FOOTER_SETTINGS } from '@src/features/email-customizer/components/sidebar/element-editor/special-editor-screen/global-footer-editor-screen';
import { DEFAULT_GLOBAL_HEADER_SETTINGS } from '@src/features/email-customizer/components/sidebar/element-editor/special-editor-screen/global-header-editor-screen';
import { IElement, IShortcode } from '@src/features/email-customizer/type';
import { ITemplate } from '@src/features/email-templates';
import { setAutoFreeze } from 'immer';
import debounce from 'lodash.debounce';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

setAutoFreeze(false);
type UpdateChosenTemplateDataCallback = (data: any) => void;

type GlobalHeaderFooterType = {
  globalHeaderElements: IElement[];
  globalFooterElements: IElement[];
};

export interface ICustomizerPageState {
  templates: ITemplate[];
  shortcodes: IShortcode[];
  elements: IElement[];
  currentTemplate: string | null;
  templateData: ITemplate | null;
  isPageLoading: boolean;
  isReviewed: boolean;
  globalHeaderFooter: GlobalHeaderFooterType;
  isTourMode: boolean;
  globalVariables?: IGlobalVariables;
  setTourMode: (value: boolean) => void;
  setTemplates: (templates: ITemplate[]) => void;
  setElements: (elements: IElement[]) => void;
  setShortcodes: (elements: IShortcode[]) => void;
  updateCurrentTemplate: (value: string | null) => void;
  setIsPageLoading: (value: boolean) => void;
  setIsReviewed: (value: boolean) => void;
  updateTemplates: (value: ITemplate[]) => void;
  updateTemplateData: (value: ITemplate | null) => void;
  updateTemplateSettings: (
    key: keyof Pick<
      ITemplate,
      | 'background_color'
      | 'content_background_color'
      | 'text_link_color'
      | 'content_text_color'
      | 'title_color'
      | 'preheader'
      | 'email_subject'
    >,
    value: string,
  ) => void;
  updateTemplateSettingsObject: (cb: any) => void;
  updateItemTemplates: (fn: UpdateChosenTemplateDataCallback, templateName: string) => void;
  setGlobalHeaderFooter: (globalHeaderFooter: GlobalHeaderFooterType) => void;
  hideTemplateGlobalFooter: (value: boolean) => void;
  hideTemplateGlobalHeader: (value: boolean) => void;
}

const DEFAULT_GLOBAL_HEADER_FOOTER = {
  globalHeaderElements: window.yaymailData.builder.global_headers_footers.global_header_elements,
  globalFooterElements: window.yaymailData.builder.global_headers_footers.global_footer_elements,
};

const useCustomizerPageStore = createWithEqualityFn<ICustomizerPageState>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        templates: [],
        shortcodes: [],
        elements: [],
        currentTemplate: null,
        templateData: null,
        isPageLoading: false,
        isReviewed: window.yaymailData.reviewed,
        globalHeaderFooter: DEFAULT_GLOBAL_HEADER_FOOTER,
        isTourMode: window.yaymailData.ghf_tour != 'second_move',
        setTourMode: (value: boolean) => {
          set((state) => {
            state.isTourMode = value;
          });
        },
        setTemplates: (templates) => {
          set((state) => {
            state.templates = templates;
          });
        },
        setElements: (elements) => {
          set((state) => {
            state.elements = elements;
          });
        },
        setShortcodes: (shortcodes) => {
          set((state) => {
            // Components filter this during render; a non-array value here
            // white-screens the whole customizer.
            state.shortcodes = Array.isArray(shortcodes) ? shortcodes : [];
          });
        },
        updateTemplates: (data) => {
          set((state) => {
            state.templates = data;
          });
        },
        updateTemplateData: (data) => {
          set((state) => {
            state.templateData = data;
          });
        },
        updateCurrentTemplate: (value) =>
          set((state) => {
            state.currentTemplate = value;
          }),
        setIsPageLoading: (value) => {
          set((state) => {
            state.isPageLoading = value;
          });
        },
        setIsReviewed: (value) => {
          set((state) => {
            state.isReviewed = value;
          });
        },
        updateTemplateSettings: (key, value) =>
          set((state) => {
            if (state.templateData) {
              state.templateData[key] = value;
            }
          }),
        updateTemplateSettingsObject: (cb: any) =>
          set((state) => {
            cb(state);
          }),
        updateItemTemplates: (fn, templateName) => {
          set((state) => {
            if (state.templates) {
              fn(state.templates.find((obj) => obj['name'] === templateName));
            }
          });
        },
        setGlobalHeaderFooter: (globalHeaderFooter: GlobalHeaderFooterType) => {
          set((state) => {
            state.globalHeaderFooter = globalHeaderFooter;
          });
        },
        hideTemplateGlobalHeader: (value: boolean) => {
          set((state) => {
            if (!state.templateData) {
              return;
            }
            if (state.templateData?.global_header_settings) {
              state.templateData.global_header_settings.hidden = value;
            } else {
              state.templateData.global_header_settings = {
                ...DEFAULT_GLOBAL_HEADER_SETTINGS,
                hidden: value,
              };
            }
          });
        },
        hideTemplateGlobalFooter: (value: boolean) => {
          set((state) => {
            if (!state.templateData) {
              return;
            }
            if (state.templateData?.global_footer_settings) {
              state.templateData.global_footer_settings.hidden = value;
            } else {
              state.templateData.global_footer_settings = {
                ...DEFAULT_GLOBAL_FOOTER_SETTINGS,
                hidden: value,
              };
            }
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

// TODO: link color
const debouncedApplyLinkColor = debounce(([currentTemplate, textLinkColor]) => {
  // Select all anchor elements within the targeted template container
  const selector = `.yaymail-customizer-email-template-container.yaymail-template-${currentTemplate} a:not([role="button"])`;

  // Use jQuery to apply the inline style to the selected elements
  if (textLinkColor) {
    window.jQuery(selector).css('color', textLinkColor);
  }
}, 200);

useCustomizerPageStore.subscribe(
  (state) => [state.currentTemplate, state.templateData?.text_link_color],
  debouncedApplyLinkColor,
);

export default useCustomizerPageStore;

// window.yaymailData.stores = useCustomizerPageStore;
