import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { IElement } from '@src/features/email-customizer/type';
import { findObjectById } from '@src/features/email-customizer/utils';
import useElementContextMenuStore from '@src/stores/elementContextMenu';
import useTemplateContentStore from '@src/stores/templateContent';

import { ExtraOptionsMenuContext } from './ExtraOptionsMenuContext';
import useElementExtraOptionsMenu from './useElementExtraOptionsMenu';

type ExtraOptionsMenuProviderProps = {
  children: ReactNode;
};

const ExtraOptionsMenuProvider = ({ children }: ExtraOptionsMenuProviderProps) => {
  const [dotMenuElementId, setDotMenuElementId] = useState<IElement['id'] | null>(null);

  const position = useElementContextMenuStore((state) => state.position);
  const menuTargetElementId = useElementContextMenuStore((state) => state.menuTargetElementId);
  const useMultiSelect = useElementContextMenuStore((state) => state.useMultiSelect);
  const closeContextMenu = useElementContextMenuStore((state) => state.closeContextMenu);

  const list = useTemplateContentStore((state) => state.list);
  const chosenElement = useTemplateContentStore((state) => state.chosenElement);
  const multiSelectedList = useTemplateContentStore((state) => state.multiSelectedList);

  const menuTargetElement = useMemo(() => {
    if (useMultiSelect && multiSelectedList.length > 1) {
      return multiSelectedList[0] ?? null;
    }

    if (menuTargetElementId != null) {
      return findObjectById(menuTargetElementId, list);
    }

    if (dotMenuElementId != null) {
      return findObjectById(dotMenuElementId, list);
    }

    return chosenElement;
  }, [
    useMultiSelect,
    multiSelectedList,
    menuTargetElementId,
    dotMenuElementId,
    list,
    chosenElement,
  ]);

  const handleCloseMenu = useCallback(() => {
    closeContextMenu();
    setDotMenuElementId(null);
  }, [closeContextMenu]);

  useEffect(() => {
    if (position) {
      setDotMenuElementId(null);
    }
  }, [position]);

  const { items, modals, messageContextHolder } = useElementExtraOptionsMenu(menuTargetElement, {
    onCloseMenu: handleCloseMenu,
    isContextMenuOpen: position != null,
    isDotMenuOpen: dotMenuElementId != null,
  });

  const contextValue = useMemo(
    () => ({
      items,
      dotMenuElementId,
      setDotMenuElementId,
      closeContextMenu,
    }),
    [items, dotMenuElementId, closeContextMenu],
  );

  return (
    <ExtraOptionsMenuContext.Provider value={contextValue}>
      {messageContextHolder}
      {modals}
      {children}
    </ExtraOptionsMenuContext.Provider>
  );
};

export default ExtraOptionsMenuProvider;
