/* eslint-disable no-unused-vars */
import { ReactNode } from 'react';

import { IconType, NotificationPlacement } from 'antd/es/notification/interface';

import { create } from 'zustand';

type NotifyFunctionType = (
  type: IconType,
  message: string | ReactNode,
  placement?: NotificationPlacement,
) => void;
export interface INotificationStoreState {
  notify: NotifyFunctionType | null;
  setNotifyFunction: (fn: NotifyFunctionType) => void;
}

const useCustomNotificationStore = create<INotificationStoreState>()((set, get) => ({
  notify: null,
  setNotifyFunction: (fn) => {
    set((state) => {
      return {
        ...state,
        notify: fn,
      };
    });
  },
}));

export default useCustomNotificationStore;
