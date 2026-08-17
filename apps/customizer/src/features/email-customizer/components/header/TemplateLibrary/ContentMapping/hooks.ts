import { useCallback, useEffect, useRef, useState } from 'react';

import { ElementId, MappingDecision } from './types';

export interface HoverDecision {
  decision: MappingDecision;
  chosenOldIndex: number;
}

/**
 * 80ms debounced hover preview state.
 * Prevents render-storms when the cursor moves rapidly across options.
 * Clears automatically when the popover closes (isOpen → false).
 */
export function useHoverPreview(isOpen: boolean) {
  const [decision, setDecision] = useState<HoverDecision | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preview = useCallback((d: MappingDecision, idx: number) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDecision({ decision: d, chosenOldIndex: idx }), 80);
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setDecision(null);
  }, []);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  return { decision, preview, reset };
}

const MAPPING_OPEN_DELAY_MS = 150;
const MAPPING_CLOSE_DELAY_MS = 200;

/** Active slotted target + preview hover open/close scheduling. */
export function useMappingTargetState() {
  const [activeTargetId, setActiveTargetId] = useState<ElementId | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openTarget = useCallback(
    (sourceId: ElementId) => {
      clearOpenTimer();
      clearCloseTimer();
      setActiveTargetId(sourceId);
    },
    [clearOpenTimer, clearCloseTimer],
  );

  const close = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setActiveTargetId(null);
  }, [clearOpenTimer, clearCloseTimer]);

  const scheduleOpenTarget = useCallback(
    (sourceId: ElementId) => {
      clearCloseTimer();
      clearOpenTimer();
      openTimer.current = setTimeout(() => {
        openTimer.current = null;
        setActiveTargetId(sourceId);
      }, MAPPING_OPEN_DELAY_MS);
    },
    [clearCloseTimer, clearOpenTimer],
  );

  const cancelScheduledOpen = useCallback(() => {
    clearOpenTimer();
  }, [clearOpenTimer]);

  const scheduleCloseTarget = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setActiveTargetId(null);
    }, MAPPING_CLOSE_DELAY_MS);
  }, [clearOpenTimer, clearCloseTimer]);

  const cancelScheduledClose = useCallback(() => {
    clearCloseTimer();
  }, [clearCloseTimer]);

  useEffect(
    () => () => {
      clearOpenTimer();
      clearCloseTimer();
    },
    [clearOpenTimer, clearCloseTimer],
  );

  return {
    activeTargetId,
    openTarget,
    close,
    scheduleOpenTarget,
    cancelScheduledOpen,
    scheduleCloseTarget,
    cancelScheduledClose,
  };
}

/**
 * Tracks element refs by ID and scrolls them to the top of a shared container.
 */
export function useScrollToTracked() {
  const elRefs = useRef<Record<ElementId, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const setRef = useCallback(
    (id: ElementId) => (el: HTMLDivElement | null) => {
      elRefs.current[id] = el;
    },
    [],
  );

  const scrollTo = useCallback((id: ElementId) => {
    const el = elRefs.current[id];
    const container = containerRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    container.scrollTo({
      top: container.scrollTop + elRect.top - containerRect.top - 16,
      behavior: 'smooth',
    });
  }, []);

  return { containerRef, setRef, scrollTo };
}
