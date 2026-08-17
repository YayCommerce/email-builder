import { CSSProperties, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';

import Portal from '@src/components/portal';

import { useOutsideClick } from '@src/hooks/useOutsideClick';

import './index.scss';

const VIEWPORT_PADDING = 8;

export type CustomContextMenuProps = PropsWithChildren<{
  position: { x: number; y: number } | false;
  onClickOutside: () => void;
}>;

const getAdjustedPosition = (
  position: { x: number; y: number },
  menuRect: DOMRect,
): { x: number; y: number } | null => {
  if (menuRect.height === 0 && menuRect.width === 0) {
    return null;
  }

  let { x, y } = position;

  if (y + menuRect.height + VIEWPORT_PADDING > window.innerHeight) {
    y = Math.max(VIEWPORT_PADDING, y - menuRect.height);
  }

  if (x + menuRect.width + VIEWPORT_PADDING > window.innerWidth) {
    x = Math.max(VIEWPORT_PADDING, x - menuRect.width);
  }

  return { x, y };
};

const CustomContextMenu = ({ children, position, onClickOutside }: CustomContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number; y: number } | null>(null);
  const [isPositionReady, setIsPositionReady] = useState(false);

  useLayoutEffect(() => {
    if (!position) {
      setAdjustedPosition(null);
      setIsPositionReady(false);
      return;
    }

    setAdjustedPosition(null);
    setIsPositionReady(false);

    const measureAndApply = () => {
      const menuEl = menuRef.current;
      if (!menuEl) return;

      const adjusted = getAdjustedPosition(position, menuEl.getBoundingClientRect());
      if (!adjusted) return;

      setAdjustedPosition(adjusted);
      setIsPositionReady(true);
    };

    measureAndApply();

    const rafId = requestAnimationFrame(measureAndApply);

    const menuEl = menuRef.current;
    const resizeObserver =
      menuEl &&
      new ResizeObserver(() => {
        measureAndApply();
      });

    if (menuEl && resizeObserver) {
      resizeObserver.observe(menuEl);
    }

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, [position, children]);

  useOutsideClick(
    () => {
      onClickOutside();
    },
    Boolean(position),
    {
      ignoredElementsCssSelectors: [
        '.yaymail-context-menu-item',
        '.yaymail-custom-context-menu',
        '.yaymail-element-extra-options-menu',
      ],
    },
    ['.yaymail-tabs-nav-wrap'].join(','),
  );

  if (!position) return null;

  const displayPosition = adjustedPosition ?? position;

  const contextMenuContainerStyle: CSSProperties = {
    top: displayPosition.y,
    left: displayPosition.x,
    visibility: isPositionReady ? 'visible' : 'hidden',
    pointerEvents: isPositionReady ? 'auto' : 'none',
  };

  return (
    <Portal>
      <div ref={menuRef} className="yaymail-custom-context-menu" style={contextMenuContainerStyle}>
        {children}
      </div>
    </Portal>
  );
};

export default CustomContextMenu;
