import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { changeStatuses, getTemplates, resetTemplates } from '@src/common/api/templateApi';
import { ITemplate } from '@src/features/email-templates';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { filterTemplatesByPlatform } from '@src/utils';

function useTemplatesListQueries(isCallingFromDashboard?: boolean) {
  const queryClient = useQueryClient();

  const isInitialTemplateDataLoading = isCallingFromDashboard
    ? false
    : window.yaymailData.isInitialTemplateDataLoading;

  const setTemplates = useCustomizerPageStore((state) => state.setTemplates);

  const queryResult = useQuery<ITemplate[]>({
    queryKey: ['templates'],
    queryFn: async (): Promise<ITemplate[]> => {
      if (isInitialTemplateDataLoading) return [];
      const response = await getTemplates();
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }
      queryClient.invalidateQueries({ queryKey: ['template'] });
      return filterTemplatesByPlatform((response.data ?? []) as ITemplate[]);
    },
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const changeStatusesMutation = useMutation({
    mutationFn: changeStatuses,
    // TODO: consider to refetch after success/ or using response data to re-assign templates list
    onSuccess: (_, payload) => {
      queryClient.setQueryData(['templates'], (old: any) => {
        if (old == null) return old;
        return old.map((template: ITemplate) => {
          if (payload.list_id.includes(template.id)) {
            return {
              ...template,
              status: payload.status,
            };
          }
          return template;
        });
      });
      queryClient.invalidateQueries({ queryKey: ['template'] });
    },
  });

  const resetTemplatesMutation = useMutation({
    mutationFn: resetTemplates,
    onSuccess: () =>
      queryClient.invalidateQueries({
        // TODO: need to filter with queryKey[3] and the list reseted templates
        predicate: (query) => query.queryKey[0] === 'template',
      }),
  });

  useEffect(() => {
    setTemplates(filterTemplatesByPlatform((queryResult.data ?? []) as ITemplate[]));
  }, [queryResult.data]);

  return {
    ...queryResult,
    changeStatusesMutation,
    resetTemplatesMutation,
  };
}

export default useTemplatesListQueries;
