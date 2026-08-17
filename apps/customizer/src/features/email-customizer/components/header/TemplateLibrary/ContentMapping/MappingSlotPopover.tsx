import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { Popover } from 'antd';

import { useHoverPreview } from './hooks';
import { useContentMappingPreview } from './mappingPreviewContext';
import SlotPopoverContent from './SlotPopoverContent';
import { MappingDecision, MappingSlotItem } from './types';

interface MappingSlotPopoverProps {
  sourceId: string | number;
  slot: MappingSlotItem;
  open: boolean;
  children: React.ReactElement;
}

const MappingSlotPopover: React.FC<MappingSlotPopoverProps> = ({
  sourceId,
  slot,
  open,
  children,
}) => {
  const {
    newTemplateName,
    close,
    setHoverPreview,
    findSlotIdx,
    updateSlotDecision,
    cancelScheduledClose,
    scheduleCloseTarget,
  } = useContentMappingPreview();

  const { decision: hoverDecision, preview, reset } = useHoverPreview(open);

  useEffect(() => {
    if (open) {
      setHoverPreview(hoverDecision);
    }
  }, [open, hoverDecision, setHoverPreview]);

  const onUpdateRef = useRef(updateSlotDecision);
  onUpdateRef.current = updateSlotDecision;
  const findSlotIdxRef = useRef(findSlotIdx);
  findSlotIdxRef.current = findSlotIdx;

  const handleConfirm = useCallback(
    (d: MappingDecision, idx: number) => {
      const slotIdx = findSlotIdxRef.current(sourceId);
      if (slotIdx !== -1) {
        onUpdateRef.current(slotIdx, d, idx);
      }
      reset();
      close();
    },
    [sourceId, reset, close],
  );

  const handlePopoverMouseEnter = useCallback(() => {
    cancelScheduledClose();
  }, [cancelScheduledClose]);

  const handlePopoverMouseLeave = useCallback(() => {
    scheduleCloseTarget();
  }, [scheduleCloseTarget]);

  const popoverContent = useMemo(
    () => (
      <div onMouseEnter={handlePopoverMouseEnter} onMouseLeave={handlePopoverMouseLeave}>
        <SlotPopoverContent
          slot={slot}
          newTemplateName={newTemplateName}
          onPreview={preview}
          onConfirm={handleConfirm}
          onResetPreview={reset}
        />
      </div>
    ),
    [
      slot,
      newTemplateName,
      preview,
      handleConfirm,
      reset,
      handlePopoverMouseEnter,
      handlePopoverMouseLeave,
    ],
  );

  return (
    <Popover
      open={open}
      onOpenChange={(visible) => {
        if (!visible) {
          reset();
          close();
        }
      }}
      trigger={[]}
      placement="bottomLeft"
      content={popoverContent}
      arrow={false}
      autoAdjustOverflow={true}
      fresh
      zIndex={11000}
      getPopupContainer={(node) =>
        (node?.closest?.('.yaymail-content-mapping__preview-body') as HTMLElement) ?? document.body
      }
    >
      {children}
    </Popover>
  );
};

export default MappingSlotPopover;
