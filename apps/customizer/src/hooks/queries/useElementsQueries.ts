import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { getElements } from '@src/common/api/templateApi';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { getDefaultTemplateName, mapColumnElements } from '@src/utils';

interface IHookProps {
  template_name?: string;
}

function useElementsQueries(props?: IHookProps) {
  const setElements = useCustomizerPageStore((state) => state.setElements);

  const { template_name = getDefaultTemplateName() } =
    props ?? {};
  const queryResult = useQuery({
    queryKey: ['elements', template_name],
    queryFn: async () => {
      if (window.yaymailData.isInitialTemplateDataLoading) return [];

      const response = await getElements(template_name);
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }
      const result = mapColumnElements(Object.values(response.data));
      return result;
    },
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    setElements(queryResult.data ?? []);
  }, [queryResult.data]);

  return {
    ...queryResult,
  };
}

export default useElementsQueries;
