import { useCallback, useEffect } from 'react';

import CustomizerLayout from '@src/layouts/customizer';
import { CustomizerProvider } from '@src/layouts/customizer/providers/CustomizerProvider';

import GlobalHFtourGhfPage from '@src/components/tours/global-hf-tour-ghf-page';

import useHideWpAdminToolbar from '@src/hooks/useHideWpAdminToolbar';
import useTemplateChangingSubscribe from '@src/hooks/useTemplateChangingSubscribe';

import { UpdateTemplatePayloadType } from '@src/common/api/types';
import { getGlobalHeaderFooterKey } from '@src/common/platform';
import { default as EmailCustomizerFeature } from '@src/features/email-customizer';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';

const GlobalHeaderFooterCustomizer = () => {
  useHideWpAdminToolbar();
  useTemplateChangingSubscribe();

  const setGlobalHeaderFooter = useCustomizerPageStore((state) => state.setGlobalHeaderFooter);
  const setSpecialEditorScreen = useTemplateContentStore((state) => state.setSpecialEditorScreen);
  const refetchGlobalHeaderFooterOnSaveSuccess = useCallback(
    (updatedData: UpdateTemplatePayloadType) => {
      const elements = updatedData.template_elements;

      const dividerIndex = elements.findIndex((element) => element.type === 'skeleton_divider');
      if (dividerIndex < 0) return;

      const globalHeaderElements = elements.slice(0, dividerIndex);
      const globalFooterElements = elements.slice(dividerIndex + 1);

      window.yaymailData.builder.global_headers_footers.global_header_elements =
        globalHeaderElements;
      window.yaymailData.builder.global_headers_footers.global_footer_elements =
        globalFooterElements;
      setGlobalHeaderFooter({ globalHeaderElements, globalFooterElements });
    },
    [],
  );

  useEffect(() => {
    setSpecialEditorScreen(null);
  }, []);

  return (
    <CustomizerProvider
      hasTemplateSelector={false}
      hasOrderSelector={false}
      hasTemplateImporter={false}
      hasActivationButton={false}
      hasSendTestMailButton={false}
      templateId={getGlobalHeaderFooterKey()}
      onSaveSuccess={refetchGlobalHeaderFooterOnSaveSuccess}
    >
      <main className="yaymail-email-customizer">
        <CustomizerLayout>
          <EmailCustomizerFeature />
        </CustomizerLayout>
      </main>
      <GlobalHFtourGhfPage />
    </CustomizerProvider>
  );
};

export default GlobalHeaderFooterCustomizer;
