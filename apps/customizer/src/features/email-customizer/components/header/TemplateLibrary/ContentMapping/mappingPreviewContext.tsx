import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { IElement } from '@src/features/email-customizer/type';

import { HoverDecision } from './hooks';
import {
  applyCommittedSlotsToPreviewForest,
  applySlotDecisionToNode,
  patchDescendantById,
} from './mappingTreeUtils';
import { buildPreviewForest } from './previewElementTree';
import { ElementId, MappingSlotItem } from './types';
import { MappingPreviewController, UpdateSlotDecision } from './useMappingPreviewController';

/* eslint-disable no-unused-vars -- callback parameters in context value type */
export type ContentMappingPreviewContextValue = Pick<
  MappingPreviewController,
  | 'activeTargetId'
  | 'openTarget'
  | 'close'
  | 'scheduleOpenTarget'
  | 'cancelScheduledOpen'
  | 'scheduleCloseTarget'
  | 'cancelScheduledClose'
  | 'findSlotIdx'
  | 'registerScrollRef'
> & {
  enabled: true;
  newTemplateName: string;
  previewRoots: IElement[];
  domIdToSourceId: Map<ElementId, ElementId>;
  getSourceId: (domId: ElementId) => ElementId;
  getSlot: (sourceId: ElementId) => MappingSlotItem | null;
  setHoverPreview: (preview: HoverDecision | null) => void;
  updateSlotDecision: UpdateSlotDecision;
};
/* eslint-enable no-unused-vars */

const ContentMappingPreviewContext = createContext<ContentMappingPreviewContextValue | null>(null);

export function useContentMappingPreview(): ContentMappingPreviewContextValue {
  const ctx = useContext(ContentMappingPreviewContext);
  if (!ctx) {
    throw new Error('useContentMappingPreview must be used within ContentMappingPreviewProvider');
  }
  return ctx;
}

export function useContentMappingPreviewOptional(): ContentMappingPreviewContextValue | null {
  return useContext(ContentMappingPreviewContext);
}

interface ContentMappingPreviewProviderProps {
  newTemplate: IElement[];
  newTemplateName: string;
  slots: MappingSlotItem[];
  controller: MappingPreviewController;
  updateSlotDecision: UpdateSlotDecision;
  children: React.ReactNode;
}

export function ContentMappingPreviewProvider({
  newTemplate,
  newTemplateName,
  slots,
  controller,
  updateSlotDecision,
  children,
}: ContentMappingPreviewProviderProps) {
  const {
    activeTargetId,
    openTarget,
    close,
    scheduleOpenTarget,
    cancelScheduledOpen,
    scheduleCloseTarget,
    cancelScheduledClose,
    findSlotIdx,
    registerScrollRef,
  } = controller;

  const [hoverPreview, setHoverPreview] = useState<HoverDecision | null>(null);

  useEffect(() => {
    if (activeTargetId == null) {
      setHoverPreview(null);
    }
  }, [activeTargetId]);

  const slotMap = useMemo(() => new Map(slots.map((slot) => [slot.newEl.id, slot])), [slots]);

  const {
    previewRoots: basePreviewRoots,
    domIdToSourceId,
    sourceIdToDomId,
  } = useMemo(() => buildPreviewForest(newTemplate), [newTemplate]);

  const getSourceId = useCallback(
    (domId: ElementId) => domIdToSourceId.get(domId) ?? domId,
    [domIdToSourceId],
  );

  const getSlot = useCallback((sourceId: ElementId) => slotMap.get(sourceId) ?? null, [slotMap]);

  const committedPreviewRoots = useMemo(
    () => applyCommittedSlotsToPreviewForest(basePreviewRoots, slots, sourceIdToDomId),
    [basePreviewRoots, slots, sourceIdToDomId],
  );

  const previewRoots = useMemo(() => {
    if (activeTargetId == null || hoverPreview == null) {
      return committedPreviewRoots;
    }

    const slot = slotMap.get(activeTargetId);
    const domId = sourceIdToDomId.get(activeTargetId);
    if (!slot || domId == null) {
      return committedPreviewRoots;
    }

    const { decision, chosenOldIndex } = hoverPreview;
    return patchDescendantById(committedPreviewRoots, domId, (node) =>
      applySlotDecisionToNode(node, slot, decision, chosenOldIndex),
    );
  }, [activeTargetId, hoverPreview, committedPreviewRoots, slotMap, sourceIdToDomId]);

  const value = useMemo<ContentMappingPreviewContextValue>(
    () => ({
      enabled: true,
      newTemplateName,
      previewRoots,
      domIdToSourceId,
      getSourceId,
      getSlot,
      activeTargetId,
      openTarget,
      close,
      scheduleOpenTarget,
      cancelScheduledOpen,
      scheduleCloseTarget,
      cancelScheduledClose,
      setHoverPreview,
      findSlotIdx,
      updateSlotDecision,
      registerScrollRef,
    }),
    [
      newTemplateName,
      previewRoots,
      domIdToSourceId,
      getSourceId,
      getSlot,
      activeTargetId,
      openTarget,
      close,
      scheduleOpenTarget,
      cancelScheduledOpen,
      scheduleCloseTarget,
      cancelScheduledClose,
      findSlotIdx,
      updateSlotDecision,
      registerScrollRef,
    ],
  );

  return (
    <ContentMappingPreviewContext.Provider value={value}>
      {children}
    </ContentMappingPreviewContext.Provider>
  );
}
