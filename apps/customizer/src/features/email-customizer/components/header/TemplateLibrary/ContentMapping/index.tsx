import React, { forwardRef, useCallback, useImperativeHandle } from 'react';

import { IElement } from '@src/features/email-customizer/type';
import classNames from 'classnames';

import EmailRecursiveElements from '../../../email-template-container/email-recursive-element';
import MappingElementList from './MappingElementList';
import { ContentMappingPreviewProvider, useContentMappingPreview } from './mappingPreviewContext';
import { ContentMappingStepProps, ElementId } from './types';
import { useContentMapping } from './useContentMapping';
import { useMappingPreviewController } from './useMappingPreviewController';

import './index.scss';

export interface ContentMappingRef {
  getFinalElements: () => IElement[];
}

function MappingPreviewBody({ previewRef }: { previewRef: React.RefObject<HTMLDivElement> }) {
  const { previewRoots } = useContentMappingPreview();

  return (
    <div
      ref={previewRef}
      className="yaymail-content-mapping__preview-body yaymail-content-mapping__preview-el-render"
    >
      <div className="yaymail-customizer-email-template-container yaymail-customizer-main">
        <EmailRecursiveElements list={previewRoots} />
      </div>
    </div>
  );
}

const ContentMapping = forwardRef<ContentMappingRef, ContentMappingStepProps>(
  ({ newTemplate, oldElements, newTemplateName, oldTemplateName }, ref) => {
    const { mapping, updateSlotDecision, getFinalElements } = useContentMapping(
      oldElements,
      newTemplate,
    );

    useImperativeHandle(ref, () => ({ getFinalElements }), [getFinalElements]);

    const { controller, updateSlotDecision: updateSlot } = useMappingPreviewController(
      mapping.slots,
      updateSlotDecision,
    );

    const handleSelectSlot = useCallback(
      (sourceId: ElementId) => {
        controller.openTarget(sourceId);
        controller.scrollTo(sourceId);
      },
      [controller],
    );

    return (
      <ContentMappingPreviewProvider
        newTemplate={newTemplate}
        newTemplateName={newTemplateName}
        slots={mapping.slots}
        controller={controller}
        updateSlotDecision={updateSlot}
      >
        <div
          className={classNames(
            'yaymail-content-mapping',
            mapping.slots.length === 0 && 'yaymail-content-mapping--preview-only',
          )}
        >
          {mapping.slots.length > 0 && (
            <MappingElementList
              slots={mapping.slots}
              activeTargetId={controller.activeTargetId}
              onSelectSlot={handleSelectSlot}
            />
          )}

          {/*
            EC1 orphan UI — temporarily disabled; re-enable LegacySection when ready.
            <LegacySection
              orphans={mapping.orphans}
              onUpdateOrphan={updateOrphanDecision}
            />
          */}

          <div className="yaymail-content-mapping__preview">
            <div className="yaymail-content-mapping__preview-header">
              <span className="yaymail-content-mapping__preview-subtitle">
                {oldTemplateName} → <strong>{newTemplateName}</strong>
              </span>
            </div>

            <MappingPreviewBody previewRef={controller.previewContainerRef} />
          </div>
        </div>
      </ContentMappingPreviewProvider>
    );
  },
);

ContentMapping.displayName = 'ContentMapping';

export default ContentMapping;
