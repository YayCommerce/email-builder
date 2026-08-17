import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { useGlobalHeaderFooterEnabled } from '@src/hooks/useGlobalHeaderFooterEnabled';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import EmailRecursiveElements from './email-recursive-element';
import { useMemo } from 'react';
import './global-header-footer-section.scss';
import { Tooltip } from 'antd';
import useTemplateContentStore from '@src/stores/templateContent';
import { GLOBAL_HEADER_FOOTER_TEMPLATE_IDS } from '@src/constants/global-header-footer';

export default function GlobalHeaderFooterSection({
  section,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  section: 'header' | 'footer';
}) {
  const globalHeaderFooterEnabled = useGlobalHeaderFooterEnabled();
  const { globalHeaderElements, globalFooterElements } = useCustomizerPageStore(
    (state) => state.globalHeaderFooter,
  );
  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const globalHeaderSettings = useCustomizerPageStore(
    (state) => state.templateData?.global_header_settings,
  );
  const globalFooterSettings = useCustomizerPageStore(
    (state) => state.templateData?.global_footer_settings,
  );
  const specialEditorScreen = useTemplateContentStore((state) => state.specialEditorScreen);
  const setSpecialEditorScreen = useTemplateContentStore((state) => state.setSpecialEditorScreen);
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);

  const elements = useMemo(() => {
    if (section === 'header') {
      return globalHeaderElements;
    }
    return globalFooterElements;
  }, [section, globalHeaderElements, globalFooterElements]);

  const isHidden = useMemo(() => {
    if (section === 'header') {
      return globalHeaderSettings?.hidden;
    }
    return globalFooterSettings?.hidden;
  }, [section, globalHeaderSettings?.hidden, globalFooterSettings?.hidden]);

  const isSelected = useMemo(() => {
    return specialEditorScreen?.key === (section === 'header' ? 'global_header' : 'global_footer');
  }, [specialEditorScreen?.key, section]);

  // Check if current template is global header/footer template
  if (
    GLOBAL_HEADER_FOOTER_TEMPLATE_IDS.includes(currentTemplate || '') ||
    currentTemplate?.startsWith('pattern_')
  )
    return null;

  // Check if global header/footer is enabled
  if (!globalHeaderFooterEnabled) return null;

  // Check if there are any elements in the section
  if (!elements || elements.length === 0) return null;
  return (
    <Tooltip title={__(`Click to edit`, 'yaymail').replace('%s', section)} placement="left">
      <div
        {...rest}
        className={classNames(
          'yaymail-customizer-email-global-header-footer-container',
          'yaymail-sortable-static',
          'yaymail-customizer-element',
          {
            'yaymail-customizer-email-global-header-footer-container-selected': isSelected,
          },
        )}
        {...(isHidden ? { 'data-hidden': true } : {})}
        {...(isSelected ? { 'data-selected': true } : {})}
        data-type={section}
        onClick={() => {
          setSpecialEditorScreen({
            key: section === 'header' ? 'global_header' : 'global_footer',
            title:
              section === 'header'
                ? __('Global Header', 'yaymail')
                : __('Global Footer', 'yaymail'),
          });
          unchooseElement();
        }}
      >
        {isHidden ? (
          <div className="yaymail-customizer-email-global-header-footer-container-hidden">
            {section === 'header' ? <HeaderSvg /> : <FooterSvg />}
          </div>
        ) : (
          <EmailRecursiveElements list={elements} />
        )}
      </div>
    </Tooltip>
  );
}

const HeaderSvg = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18.5833 1.66667V18.3333H1.91667V1.66667H18.5833ZM19.1389 0H1.36111C0.75 0 0.25 0.5 0.25 1.11111V18.8889C0.25 19.5 0.75 20 1.36111 20H19.1389C19.75 20 20.25 19.5 20.25 18.8889V1.11111C20.25 0.5 19.75 0 19.1389 0Z"
      fill="#AAACBA"
    />
    <path
      d="M17.728 2.09961H2.7613C2.61402 2.09961 2.49463 2.219 2.49463 2.36628V6.27739C2.49463 6.42466 2.61402 6.54405 2.7613 6.54405H17.728C17.8752 6.54405 17.9946 6.42466 17.9946 6.27739V2.36628C17.9946 2.219 17.8752 2.09961 17.728 2.09961Z"
      fill="#AAACBA"
    />
  </svg>
);

const FooterSvg = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.0833 1.66667V18.3333H2.41667V1.66667H19.0833ZM19.6389 0H1.86111C1.25 0 0.75 0.5 0.75 1.11111V18.8889C0.75 19.5 1.25 20 1.86111 20H19.6389C20.25 20 20.75 19.5 20.75 18.8889V1.11111C20.75 0.5 20.25 0 19.6389 0Z"
      fill="#AAACBA"
    />
    <path
      d="M18.228 13.3447H3.2613C3.11402 13.3447 2.99463 13.4641 2.99463 13.6114V17.5225C2.99463 17.6698 3.11402 17.7892 3.2613 17.7892H18.228C18.3752 17.7892 18.4946 17.6698 18.4946 17.5225V13.6114C18.4946 13.4641 18.3752 13.3447 18.228 13.3447Z"
      fill="#AAACBA"
    />
  </svg>
);
