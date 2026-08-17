import { IElement } from '@src/features/email-customizer/type';
import {
  renewElementId,
  renewElementIdWithDomToSourceIdMap,
} from '@src/features/email-customizer/utils';

import { ElementId } from './types';

/** Renew element IDs for read-only previews (iframe, template library cards). */
export function renewRootsForPreview(roots: IElement[]): IElement[] {
  return roots.map((root) => renewElementId(root));
}

/** Clone template roots for preview DOM with domId → sourceId map. */
export function buildPreviewForest(roots: IElement[]): {
  previewRoots: IElement[];
  domIdToSourceId: Map<ElementId, ElementId>;
  sourceIdToDomId: Map<ElementId, ElementId>;
} {
  const domIdToSourceId = new Map<ElementId, ElementId>();
  const sourceIdToDomId = new Map<ElementId, ElementId>();

  const previewRoots = roots.map((root) => {
    const { element, domIdToSourceId: partial } = renewElementIdWithDomToSourceIdMap(root);
    for (const [domId, sourceId] of partial) {
      domIdToSourceId.set(domId, sourceId);
      sourceIdToDomId.set(sourceId, domId);
    }
    return element;
  });

  return { previewRoots, domIdToSourceId, sourceIdToDomId };
}
