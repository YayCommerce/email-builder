import { useMutation, useQuery, useQueryClient } from 'react-query';

import { getSettings, updateSettings } from '@src/common/api/settingApi';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';

interface IHookProps {
  fetch?: boolean;
}

function useSettingsQueries(props?: IHookProps) {
  const queryClient = useQueryClient();
  const queryResult = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      if (window.yaymailData.isInitialTemplateDataLoading) return null;
      const response = await getSettings();
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    enabled: props?.fetch ?? true,
    keepPreviousData: true,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onMutate: () => {
      useCustomizerPageStore.setState((state) => {
        state.isPageLoading = true;
      });
    },
    onSettled: () => {
      useCustomizerPageStore.setState((state) => {
        state.isPageLoading = false;
      });
    },
    // TODO: consider to refetch after success/ or using response data to re-assign templates list
    onSuccess: (_, payload) => {
      useCustomizerSettingsStore.setState((state) => {
        state.hasChanged = false;
      });
      queryClient.setQueryData(['settings'], (old: any) => {
        if (old == null) return old;
        return { ...old, ...payload };
      });
    },
  });

  return {
    ...queryResult,
    saveSettingsMutation,
  };
}

export default useSettingsQueries;
