import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';

/**
 * Captures the element's offsetHeight when isOpen flips true, releases when false.
 * Locking height stops popovers from repositioning on content change (oscillation bug).
 */
export function useHeightLock(isOpen: boolean) {
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const ref = useRef(null) as MutableRefObject<HTMLDivElement | null>;

  useLayoutEffect(() => {
    if (isOpen) {
      const h = ref.current?.offsetHeight;
      if (h) setLockedHeight(h);
    } else {
      setLockedHeight(null);
    }
  }, [isOpen]);

  return { ref, lockedHeight };
}
