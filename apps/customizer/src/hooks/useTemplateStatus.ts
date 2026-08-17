import useCustomizerPageStore from '@src/stores/customizerPage';
import { useMemo } from 'react';

export default function useTemplateStatus() {
  const templateData = useCustomizerPageStore((state) => state.templateData);

  const isTemplateExist = useMemo(() => {
    return templateData && templateData?.id != null;
  }, [templateData]);

  return {
    isTemplateExist,
  };
}
