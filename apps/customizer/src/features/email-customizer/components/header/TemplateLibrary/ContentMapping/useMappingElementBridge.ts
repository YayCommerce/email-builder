import React, { useCallback, useLayoutEffect } from 'react';

import { IElement } from '@src/features/email-customizer/type';

import { useContentMappingPreviewOptional } from './mappingPreviewContext';
import { MappingSlotItem } from './types';

interface UseMappingElementBridgeOptions {
  element: IElement;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}

export function useMappingElementBridge({ element, wrapperRef }: UseMappingElementBridgeOptions) {
  const mappingPreview = useContentMappingPreviewOptional();

  const sourceId = mappingPreview?.getSourceId(element.id) ?? element.id;
  const mappingSlot: MappingSlotItem | null = mappingPreview?.enabled
    ? mappingPreview.getSlot(sourceId)
    : null;
  const isMappingPreview = Boolean(mappingPreview?.enabled);
  const isMappingPopoverOpen =
    isMappingPreview && mappingPreview?.activeTargetId === sourceId && mappingSlot != null;

  useLayoutEffect(() => {
    if (isMappingPreview && mappingSlot && mappingPreview) {
      mappingPreview.registerScrollRef(sourceId, wrapperRef.current);
    }
  }, [isMappingPreview, mappingSlot, mappingPreview, sourceId, wrapperRef]);

  const handleMappingMouseEnter = useCallback(() => {
    if (!mappingSlot || !mappingPreview) return;
    mappingPreview.cancelScheduledClose();
    mappingPreview.scheduleOpenTarget(sourceId);
  }, [mappingSlot, mappingPreview, sourceId]);

  const handleMappingMouseLeave = useCallback(() => {
    if (!mappingSlot || !mappingPreview) return;
    mappingPreview.cancelScheduledOpen();
    mappingPreview.scheduleCloseTarget();
  }, [mappingSlot, mappingPreview]);

  const openMappingTarget = useCallback(() => {
    mappingPreview?.openTarget(sourceId);
  }, [mappingPreview, sourceId]);

  return {
    sourceId,
    mappingSlot,
    isMappingPreview,
    isMappingPopoverOpen,
    handleMappingMouseEnter,
    handleMappingMouseLeave,
    openMappingTarget,
  };
}
