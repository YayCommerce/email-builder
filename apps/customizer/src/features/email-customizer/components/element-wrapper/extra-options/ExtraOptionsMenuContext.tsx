import { createContext, useContext } from 'react';

import type { MenuProps } from 'antd';

import { IElement } from '@src/features/email-customizer/type';

type ExtraOptionsMenuContextValue = {
  items: MenuProps['items'];
  dotMenuElementId: IElement['id'] | null;
  setDotMenuElementId: (elementId: IElement['id'] | null) => void;
  closeContextMenu: () => void;
};

export const ExtraOptionsMenuContext = createContext<ExtraOptionsMenuContextValue | null>(null);

export const useExtraOptionsMenuContext = () => {
  const context = useContext(ExtraOptionsMenuContext);
  if (!context) {
    throw new Error('useExtraOptionsMenuContext must be used within ExtraOptionsMenuProvider');
  }
  return context;
};
