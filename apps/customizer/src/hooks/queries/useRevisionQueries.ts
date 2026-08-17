import { useMutation, useQuery, useQueryClient } from 'react-query';

import RevisionApi from '@src/common/api/revisionApi';
import useCustomizerPageStore from '@src/stores/customizerPage';

interface IHookProps {
  template_name?: string | null;
  // lang?: string;
  fetch?: boolean;
  revision_id?: string | null;
}

function useRevisionQueries(props?: IHookProps) {
  const queryClient = useQueryClient();
  const { template_name = 'new_order' } = props ?? {};

  const getRevisionsQuery = useQuery({
    queryKey: ['revision', template_name],
    queryFn: async () => {
      if (window.yaymailData.isInitialTemplateDataLoading) return [];
      console.log('template_name', window.yaymailData.isInitialTemplateDataLoading);
      const response = await RevisionApi.getAll(template_name ?? 'new_order');
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }

      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: props?.fetch ?? true,
  });

  const clearRevisionMutation = useMutation({
    mutationFn: RevisionApi.delete,
    onMutate: () => {
      useCustomizerPageStore.setState((state) => {
        state.isPageLoading = true;
      });
    },
    onSuccess: () => {
      queryClient.setQueriesData(['revision', template_name], () => {
        return [];
      });
    },
    onSettled: () => {
      useCustomizerPageStore.setState((state) => {
        state.isPageLoading = false;
      });
    },
  });

  return {
    ...getRevisionsQuery,
    clearRevisionMutation,
  };
}

export default useRevisionQueries;
