import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { getShortcodes } from '@src/common/api/templateApi';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { getDefaultTemplateName } from '@src/utils';

interface IHookProps {
  template_name?: string;
  order_id?: string;
}

function useShortcodesQueries(props?: IHookProps) {
  const setShortcodes = useCustomizerPageStore((state) => state.setShortcodes);

  const {
    template_name = getDefaultTemplateName(),
    order_id = 'sample_order',
  } = props ?? {};
  const queryResult = useQuery({
    queryKey: ['shortcodes', template_name, order_id],
    queryFn: async () => {
      if (window.yaymailData.isInitialTemplateDataLoading) return [];
      const response = await getShortcodes(template_name, order_id);
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }
      // Anything other than an array (nonce-failure object, WAF/cache HTML page)
      // must not reach the shortcodes store — components filter it during render.
      if (!Array.isArray(response.data)) {
        throw new Error(response.data?.message ?? 'Unexpected shortcodes response');
      }
      return response.data;
    },

    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  useEffect(() => {
    setShortcodes(queryResult.data ?? []);
  }, [queryResult.data]);

  return {
    ...queryResult,
  };
}

export default useShortcodesQueries;
