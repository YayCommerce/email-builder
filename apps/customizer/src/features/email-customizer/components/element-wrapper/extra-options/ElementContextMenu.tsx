import { useEffect } from 'react';

import { Menu } from 'antd';

import CustomContextMenu from '@src/components/custom-context-menu';

import useElementContextMenuStore from '@src/stores/elementContextMenu';

import { useExtraOptionsMenuContext } from './ExtraOptionsMenuContext';

import './index.scss';

const ElementContextMenu = () => {
  const position = useElementContextMenuStore((state) => state.position);
  const closeContextMenu = useElementContextMenuStore((state) => state.closeContextMenu);
  const menuTargetElementId = useElementContextMenuStore((state) => state.menuTargetElementId);
  const useMultiSelect = useElementContextMenuStore((state) => state.useMultiSelect);

  const { items } = useExtraOptionsMenuContext();

  useEffect(() => {
    if (!position) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;

      const target = event.target as HTMLElement;
      if (
        target.closest('.yaymail-custom-context-menu') ||
        target.closest('.ant-modal-wrap') ||
        target.closest('.ant-modal-root') ||
        target.closest('.yaymail-customizer-element__extra-options')
      ) {
        return;
      }

      closeContextMenu();
    };

    document.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [position, closeContextMenu]);

  useEffect(() => {
    if (!position) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [position, closeContextMenu]);

  const hasMenuTarget = useMultiSelect || menuTargetElementId != null;

  return (
    <>
      {position && hasMenuTarget && items && items.length > 0 ? (
        <CustomContextMenu
          key={position ? `${position.x}-${position.y}` : 'closed'}
          position={position}
          onClickOutside={closeContextMenu}
        >
          <Menu items={items} selectable={false} className="yaymail-element-extra-options-menu" />
        </CustomContextMenu>
      ) : null}
    </>
  );
};

export default ElementContextMenu;
