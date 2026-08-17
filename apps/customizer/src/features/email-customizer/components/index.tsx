import { CSSProperties, useContext, useMemo } from 'react';

import { Empty } from 'antd';

import { CustomizerPageContext } from '@src/layouts/customizer/providers/CustomizerProvider';

import useTemplateStatus from '@src/hooks/useTemplateStatus';
import useUnloadConfirmation from '@src/hooks/useUnloadConfirmation';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import ElementContextMenu from './element-wrapper/extra-options/ElementContextMenu';
import ExtraOptionsMenuProvider from './element-wrapper/extra-options/ExtraOptionsMenuProvider';
import EmailTemplateContainer from './email-template-container';
import MemoizedHeader from './header';

import './index.scss';

const EmailCustomizer = () => {
  const { isPageFetching } = useContext(CustomizerPageContext);
  const { isTemplateExist } = useTemplateStatus();
  const backgroundColor = useCustomizerPageStore(
    (state) => state.templateData?.background_color ?? 'transparent',
  );

  const textLinkColor = useCustomizerPageStore(
    (state) =>
      state.templateData?.text_link_color ?? window.yaymailData.colors.default_text_link_color,
  );

  const mainSectionStyles: CSSProperties = useMemo(
    () => ({
      backgroundColor: backgroundColor || 'transparent',
    }),
    [backgroundColor],
  );

  useUnloadConfirmation();

  return (
    <>
      <style>
        {`
          .yaymail-customizer-template-section a:not([role="button"]) {
            color: ${textLinkColor};
          }
        `}
      </style>
      <MemoizedHeader />
      <main
        style={mainSectionStyles}
        className={`yaymail-customizer-template-section ${
          !isTemplateExist && 'yaymail-customizer-template-section__not-found'
        }`}
      >
        {isTemplateExist ? (
          <ExtraOptionsMenuProvider>
            <EmailTemplateContainer />
            <ElementContextMenu />
          </ExtraOptionsMenuProvider>
        ) : (
          !isPageFetching && <Empty description={__('Template not found', 'yaymail')} />
        )}
      </main>
    </>
  );
};

// TODO: disable functionalities when template not found
export default EmailCustomizer;
