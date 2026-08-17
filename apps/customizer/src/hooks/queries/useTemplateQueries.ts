import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  changeStatuses,
  copyTemplate,
  getTemplateByName,
  resetTemplates,
  updateTemplate,
} from '@src/common/api/templateApi';
import { ITemplate } from '@src/features/email-templates';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { getDefaultTemplateName } from '@src/utils';

interface IHookProps {
  template_name?: string | null;
  fetch?: boolean;
}

function useTemplateQueries(props?: IHookProps) {
  const queryClient = useQueryClient();
  const { template_name = getDefaultTemplateName() } = props ?? {};

  window.yaymailData.isInitialTemplateDataLoading =
    window.yaymailData.isInitialTemplateDataLoading ?? true;

  const queryResult = useQuery({
    queryKey: ['template', template_name, window.yaymailData.isInitialTemplateDataLoading],
    queryFn: async () => {
      if (window.yaymailData.isInitialTemplateDataLoading) return null;
      const response = await getTemplateByName(template_name ?? 'new_order');
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

  const updateTemplateMutation = useMutation({
    mutationFn: updateTemplate,
    onMutate: () => {
      useCustomizerPageStore.setState((state) => {
        state.isPageLoading = true;
      });
    },
    onSuccess: (axiosResponse) => {
      queryClient.setQueriesData(['template', template_name], () => {
        return axiosResponse.data.updated_data;
      });
      queryClient.setQueriesData(['revision', template_name], (old: any) => {
        if (axiosResponse.data?.new_revision == null) return old;
        let result = [axiosResponse.data.new_revision, ...old];
        if (result.length > window.yaymailData.builder.revision_limit) {
          result = result.slice(0, window.yaymailData.builder.revision_limit);
        }
        return result;
      });
    },
    onSettled: () => {
      useCustomizerPageStore.setState((state) => {
        state.isPageLoading = false;
      });
    },
  });

  const resetTemplateMutation = useMutation({
    mutationFn: resetTemplates,
    onSuccess: (apiData) => {
      if (apiData.list_template_data == null || apiData.list_template_data.length < 1) {
        return;
      }
      const templateData = apiData.list_template_data[0];
      queryClient.setQueriesData(['template', template_name], () => {
        return templateData;
      });
      useTemplateContentStore.getState().updateList(templateData.elements);
      useCustomizerPageStore
        .getState()
        .updateTemplateSettings('background_color', templateData.background_color);
      useCustomizerPageStore
        .getState()
        .updateTemplateSettings('content_background_color', templateData.content_background_color);
      useCustomizerPageStore
        .getState()
        .updateTemplateSettings('content_text_color', templateData.content_text_color);
      useCustomizerPageStore
        .getState()
        .updateTemplateSettings('title_color', templateData.title_color);
      useCustomizerPageStore
        .getState()
        .updateTemplateSettings('text_link_color', templateData.text_link_color);
      useCustomizerPageStore.getState().hideTemplateGlobalFooter(true);
      useCustomizerPageStore.getState().hideTemplateGlobalHeader(true);
    },
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
  });

  const changeStatusMutation = useMutation({
    mutationFn: changeStatuses,
    onSuccess: (_, payload) => {
      queryClient.setQueryData(['templates'], (old: any) => {
        return old?.map((template: ITemplate) => {
          if (payload.list_id.includes(template.id.toString())) {
            return {
              ...template,
              status: payload.status,
            };
          }
          return template;
        });
      });
    },
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
  });

  const copyTemplateMutation = useMutation({
    mutationFn: copyTemplate,
    onSuccess: (axiosResponse) => {
      if (axiosResponse.success) {
        queryClient.invalidateQueries({ queryKey: ['template', template_name] });
        queryClient.invalidateQueries({ queryKey: ['revision', template_name] });
      }
    },
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
  });

  return {
    ...queryResult,
    updateTemplateMutation,
    resetTemplateMutation,
    changeStatusMutation,
    copyTemplateMutation,
  };
}

export default useTemplateQueries;
