import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import { getTemplateDataOnloadRequest } from '@src/common/ajax';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { IShortcode } from '@src/features/email-customizer/type';
import { ITemplate } from '@src/features/email-templates';
import { filterTemplatesByPlatform, getDefaultTemplateName, mapColumnElements } from '@src/utils';

interface IHookProps {
  template_name?: string;
  order_id?: string;
}

// PHP assoc arrays (or intercepted responses) serialize as objects instead of
// arrays; components filter/map these values during render, so coerce here.
function toArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function useCustomizerPageQueries(props?: IHookProps) {
  const {
    template_name = getDefaultTemplateName(),
    order_id = 'sample_order',
  } = props ?? {};

  const queryClient = useQueryClient();
  const setTemplates = useCustomizerPageStore((state) => state.setTemplates);
  const setElements = useCustomizerPageStore((state) => state.setElements);
  const setShortcodes = useCustomizerPageStore((state) => state.setShortcodes);
  const updateSettings = useCustomizerSettingsStore((state) => state.updateSettings);
  useEffect(() => {
    const fetchTemplateDataOnLoad = async () => {
      try {
        useCustomizerPageStore.setState((state) => {
          state.isPageLoading = true;
        });
        window.yaymailData.isInitialTemplateDataLoading = true;
        const response = await getTemplateDataOnloadRequest({ ...(props ?? {}) });
        const data = response?.data;

        /**
         * Load Global Settings
         */
        queryClient.setQueryData(['settings'], data?.settings_data);
        updateSettings(data?.settings_data);

        /**
         * Load All Templates
         */
        const templatesData = filterTemplatesByPlatform((toArray(data?.templates_data)) as ITemplate[]);
        queryClient.setQueryData(['templates'], templatesData);
        setTemplates(templatesData);

        /**
         * Load Selected Template
         */
        queryClient.setQueryData(
          ['template', template_name ?? 'new_order', false],
          data?.selected_template_data,
        );

        /**
         * Load Sidebar elements
         */
        const elements = mapColumnElements(Object.values(data?.elements_data ?? {}));
        queryClient.setQueryData(['elements', template_name], elements);
        setElements(elements);

        /**
         * Load Revisions
         */
        queryClient.setQueryData(['revision', template_name], toArray(data?.revisions_data));

        /**
         * Load Shortcodes
         */
        const shortcodesData = toArray<IShortcode>(data?.shortcodes_data);
        queryClient.setQueryData(['shortcodes', template_name, order_id], shortcodesData);
        setShortcodes(shortcodesData);
      } catch (e) {
        console.debug('YayMail: ', 'Error trying to load template data\n', e);
      } finally {
        window.yaymailData.isInitialTemplateDataLoading = false;
        useCustomizerPageStore.setState((state) => {
          state.isPageLoading = false;
        });
      }
    };

    fetchTemplateDataOnLoad();
  }, []);
}

export default useCustomizerPageQueries;
