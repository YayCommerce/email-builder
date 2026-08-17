import { memo, useContext } from 'react';

import { Alert, Button } from 'antd';

import { CustomizerPageContext } from '@src/layouts/customizer/providers/CustomizerProvider';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import ActionsDropdown from './ActionsDropdown';
import ClearTemplate from './ClearTemplate';
import EnableTemplate from './EnableTemplate';
import ImportTemplate from './ImportTemplate';
import PreviewTemplate from './PreviewTemplate';
import ResetTemplate from './ResetTemplate';
import SaveTemplate from './SaveTemplate';
import SelectOrder from './SelectOrder';
import SelectTemplate from './SelectTemplate';
import SendTestMail from './SendTestMail';
import ShortcodesInformation from './ShortcodesInformation';
import TemplateLibrary from './TemplateLibrary';
import ToggleGlobalHeaderFooter from './ToggleGlobalHeaderFooter';
import UndoRedo from './UndoRedo';
import { useGlobalHeaderFooterEnabled } from '@src/hooks/useGlobalHeaderFooterEnabled';

import './index.scss';
import { GLOBAL_HEADER_FOOTER_TEMPLATE_IDS } from '@src/constants/global-header-footer';

const Header = () => {
  const {
    hasTemplateSelector,
    hasOrderSelector,
    hasTemplateImporter,
    hasActivationButton,
    hasSendTestMailButton,
  } = useContext(CustomizerPageContext);

  const template = useCustomizerPageStore((state) => state.currentTemplate);

  return (
    <section className="yaymail-email-customizer__header">
      <div className="yaymail-email-customizer__header--left">
        {hasTemplateSelector && <SelectTemplate />}
        {hasOrderSelector && !template?.startsWith('wp-core-') && <SelectOrder />}
        <div className="header__actions">
          <TemplateLibrary />
          <ShortcodesInformation />
          <ClearTemplate />
          {hasTemplateImporter && <ImportTemplate />}
          <ResetTemplate />
          <UndoRedo enableKeyboard />
        </div>
        <div className="header__actions--compact">
          <TemplateLibrary />
          <UndoRedo />
          <ActionsDropdown
            hasTemplateImporter={hasTemplateImporter}
            showReset={!template?.startsWith('pattern_')}
          />
        </div>
      </div>
      <div className="yaymail-email-customizer__header--right">
        {GLOBAL_HEADER_FOOTER_TEMPLATE_IDS.includes(template || '') && <GlobalHeaderFooterNotice />}
        <PreviewTemplate />
        {hasSendTestMailButton && <SendTestMail />}
        {hasActivationButton && <EnableTemplate />}
        <SaveTemplate
          hasLoading
          savingText=""
          enableSaveAsTemplate={template !== 'yaymail_global_header_footer'}
        />
      </div>
    </section>
  );
};

const MemoizedHeader = memo(Header);

function GlobalHeaderFooterNotice() {
  const globalHeaderFooterEnabled = useGlobalHeaderFooterEnabled();
  const setTourMode = useCustomizerPageStore((state) => state.setTourMode);
  return (
    <>
      <Button
        onClick={() => {
          setTourMode(true);
        }}
      >
        Guidance
      </Button>
      <Alert
        message={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {__('Global header/footer is %1s', 'yaymail').replace(
              '%1s',
              globalHeaderFooterEnabled ? __('ON', 'yaymail') : __('OFF', 'yaymail'),
            ) +
              (globalHeaderFooterEnabled
                ? '.'
                : __(', please %2s it globally.', 'yaymail').replace(
                    '%2s',
                    globalHeaderFooterEnabled ? __('disable', 'yaymail') : __('enable', 'yaymail'),
                  ))}
            <ToggleGlobalHeaderFooter />
          </div>
        }
        type="info"
        showIcon
      />
    </>
  );
}

export default MemoizedHeader;
