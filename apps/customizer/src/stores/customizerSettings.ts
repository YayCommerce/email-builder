/* eslint-disable no-unused-vars */
import { setAutoFreeze } from 'immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

setAutoFreeze(false);

export interface ICustomizerSettingsState {
  settings: {
    direction: 'ltr' | 'rtl';
    container_width: number;

    // TODO Complete the type
    payment_display_mode: 'yes' | unknown;
    show_product_image?: unknown;
    product_image_position: 'top' | unknown;
    product_image_height: number;
    product_image_width: number;
    show_product_sku: '1' | unknown;
    show_product_description?: unknown;
    show_product_hyper_links?: unknown;
    show_product_regular_price?: unknown;
    show_product_item_cost?: unknown;
    enable_custom_css?: boolean;
    custom_css?: string;
    product_image_size: 'thumbnail' | unknown;
    global_header_footer_enabled?: boolean;
    wp_global_header_footer_enabled?: boolean;
  } | null;
  hasChanged: boolean;
  updateSettings: (data: any) => void;
  updateSettingsStatus: (status: boolean) => void;
}

const useCustomizerSettingsStore = createWithEqualityFn<ICustomizerSettingsState>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        settings: null,
        hasChanged: false,
        updateSettings: (data) => {
          set((state) => {
            state.settings = {
              ...state.settings,
              ...data,
            };
          });
        },
        updateSettingsStatus: (status: boolean) => {
          set((state) => {
            state.hasChanged = status;
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default useCustomizerSettingsStore;
