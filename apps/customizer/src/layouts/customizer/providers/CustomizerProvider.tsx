import React, { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import useCustomizerPageQueries from '@src/hooks/queries/useCustomizerPageQueries';
import useElementsQueries from '@src/hooks/queries/useElementsQueries';
import useSettingsQueries from '@src/hooks/queries/useSettingsQueries';
import useShortcodesQueries from '@src/hooks/queries/useShortcodesQueries';
import useTemplateQueries from '@src/hooks/queries/useTemplateQueries';
import useTemplatesListQueries from '@src/hooks/queries/useTemplatesListQueries';
import useRevisionQueries from '@src/hooks/queries/useRevisionQueries';

import { UpdateTemplatePayloadType } from '@src/common/api/types';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';

import { OrderDataContext } from './OrderDataProvider';
import useTemplateContentHistoryStore from '@src/stores/templateContentHistory';

export interface ICustomizerProvider {
  children: ReactNode;
  hasTemplateSelector?: boolean;
  hasOrderSelector?: boolean;
  hasTemplateImporter?: boolean;
  hasActivationButton?: boolean;
  hasSendTestMailButton?: boolean;
  templateId?: string;
  // eslint-disable-next-line no-unused-vars
  onSaveSuccess?: (updatedData: UpdateTemplatePayloadType) => void;
}

export interface ICustomizerPageContext
  extends Omit<ICustomizerProvider, 'children' | 'templateId'> {
  isPageFetching: boolean;
}

export const CustomizerPageContext = createContext<ICustomizerPageContext>({
  isPageFetching: false,
});

export const CustomizerProvider: React.FC<ICustomizerProvider> = (props) => {
  const { children, templateId, ...restProps } = props;

  const { selectedOrderID } = useContext(OrderDataContext);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const updateCurrentTemplate = useCustomizerPageStore((state) => state.updateCurrentTemplate);
  const updateTemplateData = useCustomizerPageStore((state) => state.updateTemplateData);
  const setCustomizerContent = useTemplateContentStore((state) => state.updateList);
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);
  const pushNewChange = useTemplateContentHistoryStore((state) => state.pushNewChange);

  const templateSearchParam = useMemo(() => searchParams.get('template'), [searchParams]);

  const selectedTemplate = useCustomizerPageStore(
    // TODO consider remove templateId here, disable template related queries when template = null
    (state) => templateSearchParam ?? state.currentTemplate ?? templateId,
  );

  useEffect(() => {
    updateCurrentTemplate(templateId ?? templateSearchParam);
  }, [templateId, templateSearchParam]);

  useCustomizerPageQueries({
    template_name: selectedTemplate,
    order_id: selectedOrderID,
  });

  const { isFetching: isElementQueriesFetching } = useElementsQueries({
    template_name: selectedTemplate,
  });
  const { isFetching: isRevisionQueriesFetching } = useRevisionQueries({
    template_name: selectedTemplate,
  });
  const { isFetching: isShortcodesQueriesFetching } = useShortcodesQueries({
    template_name: selectedTemplate,
    order_id: selectedOrderID,
  });
  const { data: templateQueriesData, isFetching: isTemplateQueriesFetching } = useTemplateQueries({
    template_name: selectedTemplate,
  });
  const { isFetching: isSettingsFetching } = useSettingsQueries();

  const { isFetching: isTemplateListFetching } = useTemplatesListQueries();

  useEffect(() => {
    updateTemplateData(templateQueriesData);
    setCustomizerContent(templateQueriesData?.elements ?? []);
    changeContentStatus(false);
    pushNewChange(templateQueriesData?.elements ?? [], {
      action: 'initialized',
    });
  }, [templateQueriesData]);

  const pageContextValue = useMemo(
    () => ({
      isPageFetching:
        window.yaymailData.isInitialTemplateDataLoading ||
        isElementQueriesFetching ||
        isRevisionQueriesFetching ||
        isShortcodesQueriesFetching ||
        isSettingsFetching ||
        isTemplateListFetching ||
        isTemplateQueriesFetching,
      hasTemplateSelector: true,
      hasOrderSelector: true,
      hasTemplateImporter: true,
      hasActivationButton: true,
      hasSendTestMailButton: true,
      ...restProps,
    }),
    [
      selectedTemplate,
      window.yaymailData.isInitialTemplateDataLoading,
      isElementQueriesFetching,
      isRevisionQueriesFetching,
      isShortcodesQueriesFetching,
      isTemplateQueriesFetching,
      isSettingsFetching,
      isTemplateListFetching,
      restProps,
    ],
  );

  return (
    <CustomizerPageContext.Provider value={pageContextValue as any}>
      {children}
    </CustomizerPageContext.Provider>
  );
};
