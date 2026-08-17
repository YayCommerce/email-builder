import { IElement } from '@src/features/email-customizer/type';

export type ElementId = string | number;

export type MappingDecision = 'use_new' | 'use_old';

// EC1: replaces `keep: boolean` — default is 'append' (not 'delete')
export type OrphanDecision = 'append' | 'delete';

export interface MappingSlotItem {
  newEl: IElement;
  oldMatches: IElement[]; // ALL old elements of same type (EC7: no exclusion per slot)
  decision: MappingDecision;
  chosenOldIndex: number; // index-based default for position proximity (EC4+EC7)
}

export interface OrphanItem {
  element: IElement;
  decision: OrphanDecision; // EC1: replaces `keep: boolean`
}

export interface ContentMapping {
  slots: MappingSlotItem[];
  orphans: OrphanItem[];
}

export interface ContentMappingStepProps {
  newTemplate: IElement[];
  oldElements: IElement[];
  newTemplateName: string;
  oldTemplateName: string;
}
