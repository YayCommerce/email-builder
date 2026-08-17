import { IElement } from '@src/features/email-customizer/type';

import {
  isContentEqual,
  isDetectableMappingElement,
  mergeOldContentFieldsIntoNewElement,
} from './mappingContent';
import { ContentMapping, ElementId, MappingSlotItem, OrphanItem } from './types';

export {
  MAPPING_DETECT_ELEMENT_TYPES,
  isContentEqual,
  isDetectableMappingElement,
  mergeOldContentFieldsIntoNewElement,
} from './mappingContent';
export type { DetectableElementType } from './mappingContent';

function defaultMatchIndex(groupIndex: number, matchCount: number): number {
  return Math.min(groupIndex, Math.max(0, matchCount - 1));
}

// eslint-disable-next-line no-unused-vars -- visitor callback type parameter
function forEachDetectable(roots: IElement[], visit: (element: IElement) => void): void {
  const walk = (element: IElement) => {
    if (isDetectableMappingElement(element)) {
      visit(element);
    }
    for (const child of element.children ?? []) {
      walk(child);
    }
  };
  for (const root of roots) {
    walk(root);
  }
}

function collectDetectableByType(roots: IElement[]): Record<string, IElement[]> {
  const byType: Record<string, IElement[]> = {};
  forEachDetectable(roots, (element) => {
    (byType[element.type] ??= []).push(element);
  });
  return byType;
}

function collectOrphans(oldElements: IElement[], assignedOldIds: Set<ElementId>): OrphanItem[] {
  const orphans: OrphanItem[] = [];
  forEachDetectable(oldElements, (element) => {
    if (!assignedOldIds.has(element.id)) {
      orphans.push({ element, decision: 'delete' });
    }
  });
  return orphans;
}

/**
 * Compute mapping on the full template tree (nested blocks included).
 */
export function computeMapping(oldElements: IElement[], newElements: IElement[]): ContentMapping {
  const oldByType = collectDetectableByType(oldElements);
  const primaryAssignedIds = new Set<ElementId>();
  const groupIndexByType: Record<string, number> = {};
  const slots: MappingSlotItem[] = [];

  forEachDetectable(newElements, (newEl) => {
    const type = newEl.type;
    const groupIdx = groupIndexByType[type] ?? 0;
    groupIndexByType[type] = groupIdx + 1;

    const oldMatches = oldByType[type] ?? [];
    if (oldMatches.length === 0) {
      return;
    }

    const chosenOldIndex = defaultMatchIndex(groupIdx, oldMatches.length);
    const matchedOld = oldMatches[chosenOldIndex];
    primaryAssignedIds.add(matchedOld.id);

    if (!isContentEqual(matchedOld, newEl)) {
      slots.push({
        newEl,
        oldMatches,
        decision: 'use_new',
        chosenOldIndex,
      });
    }
  });

  return {
    slots,
    orphans: collectOrphans(oldElements, primaryAssignedIds),
  };
}

function applySlotsToTree(
  nodes: IElement[],
  slotsByNewId: Map<ElementId, MappingSlotItem>,
  usedOldIds: Set<ElementId>,
): IElement[] {
  return nodes.map((node) => {
    const slot = slotsByNewId.get(node.id);
    if (slot) {
      if (slot.decision === 'use_old') {
        const chosen = slot.oldMatches[slot.chosenOldIndex];
        usedOldIds.add(chosen.id);
        return mergeOldContentFieldsIntoNewElement(node, chosen);
      }
      return node;
    }

    if (!node.children?.length) {
      return node;
    }

    return {
      ...node,
      children: applySlotsToTree(node.children, slotsByNewId, usedOldIds),
    };
  });
}

export function buildFinalElements(
  newTemplate: IElement[],
  slots: MappingSlotItem[],
  orphans: OrphanItem[],
): IElement[] {
  const usedOldIds = new Set<ElementId>();
  const slotsByNewId = new Map(slots.map((slot) => [slot.newEl.id, slot]));
  const result = applySlotsToTree(newTemplate, slotsByNewId, usedOldIds);

  const appended = orphans
    .filter((orphan) => orphan.decision === 'append' && !usedOldIds.has(orphan.element.id))
    .map((orphan) => orphan.element);

  return [...result, ...appended];
}
