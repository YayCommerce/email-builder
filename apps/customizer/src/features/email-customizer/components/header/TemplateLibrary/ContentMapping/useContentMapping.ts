import { useCallback, useEffect, useMemo, useState } from 'react';

import { IElement } from '@src/features/email-customizer/type';

import { buildFinalElements, computeMapping } from './mappingCore';
import { MappingDecision, OrphanDecision } from './types';

export function useContentMapping(oldElements: IElement[], newElements: IElement[]) {
  const mapping = useMemo(
    () => computeMapping(oldElements, newElements),
    [oldElements, newElements],
  );

  const [slots, setSlots] = useState(mapping.slots);
  const [orphans, setOrphans] = useState(mapping.orphans);

  useEffect(() => {
    setSlots(mapping.slots);
    setOrphans(mapping.orphans);
  }, [mapping]);

  const updateSlotDecision = (slotIndex: number, decision: MappingDecision, chosenOldIndex = 0) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === slotIndex ? { ...s, decision, chosenOldIndex } : s)),
    );
  };

  const updateOrphanDecision = (orphanIndex: number, decision: OrphanDecision) => {
    setOrphans((prev) => prev.map((o, i) => (i === orphanIndex ? { ...o, decision } : o)));
  };

  const getFinalElements = useCallback(
    () => buildFinalElements(newElements, slots, orphans),
    [newElements, slots, orphans],
  );

  return {
    mapping: { ...mapping, slots, orphans },
    updateSlotDecision,
    updateOrphanDecision,
    getFinalElements,
  };
}
