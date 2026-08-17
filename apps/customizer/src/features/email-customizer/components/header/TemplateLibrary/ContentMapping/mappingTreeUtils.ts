import { IElement } from '@src/features/email-customizer/type';

import { mergeOldContentFieldsIntoNewElement } from './mappingContent';
import { ElementId, MappingDecision, MappingSlotItem } from './types';

export function applySlotDecisionToNode(
  node: IElement,
  slot: MappingSlotItem,
  decision: MappingDecision,
  chosenOldIndex: number,
): IElement {
  if (decision === 'use_new') {
    return {
      ...slot.newEl,
      id: node.id,
      parentId: node.parentId,
      children: node.children,
    };
  }
  return mergeOldContentFieldsIntoNewElement(node, slot.oldMatches[chosenOldIndex]);
}

/** Apply all confirmed slot decisions onto the preview DOM tree. */
export function applyCommittedSlotsToPreviewForest(
  roots: IElement[],
  slots: MappingSlotItem[],
  sourceIdToDomId: Map<ElementId, ElementId>,
): IElement[] {
  let result = roots;
  for (const slot of slots) {
    const domId = sourceIdToDomId.get(slot.newEl.id);
    if (domId == null) continue;
    result = patchDescendantById(result, domId, (node) =>
      applySlotDecisionToNode(node, slot, slot.decision, slot.chosenOldIndex),
    );
  }
  return result;
}

export function patchDescendantById(
  roots: IElement[],
  targetId: ElementId,
  // eslint-disable-next-line no-unused-vars -- patch callback type parameter
  patch: (node: IElement) => IElement,
): IElement[] {
  return roots.map((node) => {
    if (node.id === targetId) return patch(node);
    if (node.children?.length) {
      return {
        ...node,
        children: patchDescendantById(node.children, targetId, patch),
      };
    }
    return node;
  });
}
