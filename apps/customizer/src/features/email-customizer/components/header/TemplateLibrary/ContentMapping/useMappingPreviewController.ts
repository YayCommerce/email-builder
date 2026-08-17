import { RefObject, useCallback } from 'react';

import { useMappingTargetState, useScrollToTracked } from './hooks';
import { ElementId, MappingDecision, MappingSlotItem } from './types';

/* eslint-disable no-unused-vars -- callback parameters in controller interface */
export interface MappingPreviewController {
  activeTargetId: ElementId | null;
  openTarget: (sourceId: ElementId) => void;
  close: () => void;
  scheduleOpenTarget: (sourceId: ElementId) => void;
  cancelScheduledOpen: () => void;
  scheduleCloseTarget: () => void;
  cancelScheduledClose: () => void;
  findSlotIdx: (sourceId: ElementId) => number;
  registerScrollRef: (sourceId: ElementId, el: HTMLDivElement | null) => void;
  previewContainerRef: RefObject<HTMLDivElement>;
  scrollTo: (sourceId: ElementId) => void;
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars -- shared callback type parameters */
export type UpdateSlotDecision = (
  slotIndex: number,
  decision: MappingDecision,
  chosenOldIndex: number,
) => void;
/* eslint-enable no-unused-vars */

export function useMappingPreviewController(
  slots: MappingSlotItem[],
  updateSlotDecision: UpdateSlotDecision,
): {
  controller: MappingPreviewController;
  updateSlotDecision: UpdateSlotDecision;
} {
  const {
    activeTargetId,
    openTarget,
    close,
    scheduleOpenTarget,
    cancelScheduledOpen,
    scheduleCloseTarget,
    cancelScheduledClose,
  } = useMappingTargetState();

  const {
    containerRef: previewContainerRef,
    setRef: setScrollRef,
    scrollTo,
  } = useScrollToTracked();

  const findSlotIdx = useCallback(
    (sourceId: ElementId) => slots.findIndex((slot) => slot.newEl.id === sourceId),
    [slots],
  );

  const registerScrollRef = useCallback(
    (sourceId: ElementId, el: HTMLDivElement | null) => {
      setScrollRef(sourceId)(el);
    },
    [setScrollRef],
  );

  const controller: MappingPreviewController = {
    activeTargetId,
    openTarget,
    close,
    scheduleOpenTarget,
    cancelScheduledOpen,
    scheduleCloseTarget,
    cancelScheduledClose,
    findSlotIdx,
    registerScrollRef,
    previewContainerRef,
    scrollTo,
  };

  return { controller, updateSlotDecision };
}
