import React, { createContext, useContext, useMemo } from 'react';

import { IElement } from '@src/features/email-customizer/type';
import useTemplateContentStore from '@src/stores/templateContent';

import { useContentMappingPreviewOptional } from './mappingPreviewContext';

const RenewedElementTreeContext = createContext<IElement[] | null>(null);

interface RenewedElementTreeProviderProps {
  roots: IElement[];
  children: React.ReactNode;
}

/** Supplies a renewed-id element tree for read-only previews (iframe, template library). */
export function RenewedElementTreeProvider({ roots, children }: RenewedElementTreeProviderProps) {
  return (
    <RenewedElementTreeContext.Provider value={roots}>
      {children}
    </RenewedElementTreeContext.Provider>
  );
}

export function useRenewedElementTreeOptional(): IElement[] | null {
  return useContext(RenewedElementTreeContext);
}

/** Canvas list, content-mapping preview forest, or renewed preview tree — whichever is active. */
export function useElementLookupTree(): IElement[] {
  const mainList = useTemplateContentStore((state) => state.list);
  const mappingPreview = useContentMappingPreviewOptional();
  const renewedTree = useRenewedElementTreeOptional();

  return useMemo(() => {
    if (mappingPreview?.enabled) {
      return mappingPreview.previewRoots;
    }
    if (renewedTree != null) {
      return renewedTree;
    }
    return mainList;
  }, [mappingPreview?.enabled, mappingPreview?.previewRoots, renewedTree, mainList]);
}
