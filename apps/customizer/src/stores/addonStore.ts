/* eslint-disable no-unused-vars */
import { ComponentType } from 'react';

import { IElement } from '@src/features/email-customizer';
import { setAutoFreeze } from 'immer';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

setAutoFreeze(false);

export interface IAddonComponent {
  type: string;
  component: ComponentType<{ element: IElement }>;
}

interface IAddonProperties {
  name: string;
  component: any;
}

export interface IAddonStoreState {
  addonComponents: IAddonComponent[];
  addonCustomPropertyEditors: IAddonProperties[];
  registerElement: (
    elementType: IAddonComponent['type'],
    component: IAddonComponent['component'],
  ) => void;
  registerAddonCustomPropertyEditor: (name: string, component: any) => void;
}

const useAddonStore = createWithEqualityFn<IAddonStoreState>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        addonComponents: [],
        addonCustomPropertyEditors: [],
        registerElement: (elementType, component) => {
          set((state) => {
            state.addonComponents.push({
              type: elementType,
              component: component,
            });
          });
        },

        registerAddonCustomPropertyEditor: (name, component) => {
          set((state) => {
            state.addonCustomPropertyEditors.push({
              name,
              component,
            });
          });
        },
      })),
    ),
  ),
  shallow, // compare values of objects instead of their refs
);

export default useAddonStore;
