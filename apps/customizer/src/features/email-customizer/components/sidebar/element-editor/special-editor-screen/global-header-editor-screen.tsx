import { useCallback, useMemo } from 'react';

import { Switch } from 'antd';

import BaseRichTextEditor from '@src/components/base-rich-text-editor';

import { isWpPlatform } from '@src/common/platform';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import { findFirstElementByType } from './find-first-element-by-type';
import useGlobalHeaderFooterNavigation from './useNavigate';

const WP_DEFAULT_HEADING_CONTENT =
  '<h1 style="font-size: 30px; font-weight: 300; line-height: normal; margin: 0px; color: inherit;">[yaymail_site_name]</h1>';

const WC_DEFAULT_HEADING_CONTENT =
  '<h1 style="font-size: 30px; font-weight: 300; line-height: normal; margin: 0px; color: inherit;">Hello YayMail</h1>';

const resolveHeadingContent = (storedContent: string | undefined): string => {
  if (!isWpPlatform()) return storedContent || WC_DEFAULT_HEADING_CONTENT;
  // On WP platform: use WP default if content is empty or is the YayMail-specific default
  if (!storedContent || storedContent === WC_DEFAULT_HEADING_CONTENT) {
    return WP_DEFAULT_HEADING_CONTENT;
  }
  return storedContent;
};

export const DEFAULT_GLOBAL_HEADER_SETTINGS = {
  content_override: false,
  heading_content: '',
  hidden: false,
};

export default function GlobalHeaderEditorScreen() {
  const globalHeaderSettings = useCustomizerPageStore(
    (state) => state.templateData?.global_header_settings,
  );
  const updateTemplateSettingsObject = useCustomizerPageStore(
    (state) => state.updateTemplateSettingsObject,
  );
  const hideTemplateGlobalHeader = useCustomizerPageStore(
    (state) => state.hideTemplateGlobalHeader,
  );
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);
  const globalHeaderElements = useCustomizerPageStore(
    (state) => state.globalHeaderFooter.globalHeaderElements,
  );
  const headingElement = useMemo(
    () => findFirstElementByType<'heading'>(globalHeaderElements, 'heading'),
    [globalHeaderElements],
  );
  const navigateAction = useGlobalHeaderFooterNavigation();
  const handleOnChangeContent = useCallback((value: string) => {
    updateTemplateSettingsObject((state: any) => {
      if (state.templateData?.global_header_settings) {
        state.templateData.global_header_settings.heading_content = value;
      } else {
        state.templateData.global_header_settings = {
          ...DEFAULT_GLOBAL_HEADER_SETTINGS,
          heading_content: value,
        };
      }
    });
    changeContentStatus(true);
  }, []);
  const handleOnChangeOverride = useCallback((value: boolean) => {
    updateTemplateSettingsObject((state: any) => {
      const settings = state.templateData?.global_header_settings;
      const currentContent = settings?.heading_content;
      // When enabling override on WP platform, replace YayMail default with WP default
      const resolvedContent =
        value ? resolveHeadingContent(currentContent) : (currentContent ?? '');
      if (settings) {
        settings.content_override = value;
        settings.heading_content = resolvedContent;
      } else {
        state.templateData.global_header_settings = {
          ...DEFAULT_GLOBAL_HEADER_SETTINGS,
          content_override: value,
          heading_content: resolvedContent,
        };
      }
    });
    changeContentStatus(true);
  }, []);
  const handleOnChangeDisplay = useCallback((value: boolean) => {
    hideTemplateGlobalHeader(value);
    changeContentStatus(true);
  }, []);

  return (
    <div>
      <div className={classNames('yaymail-editor-property', 'yaymail-editor-global-header-link')}>
        <div className="yaymail-title">
          {__(`This is the Global header element, you can customize it by go to `, 'yaymail')}
          <a onClick={navigateAction}>{__('Global header', 'yaymail')}</a>
        </div>
      </div>
      <div
        className={classNames('yaymail-editor-property', 'yaymail-editor-global-header-display')}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'space-between',
          }}
        >
          <div className="yaymail-title" style={{ marginBottom: 0 }}>
            {__('Hide on this template', 'yaymail')}
          </div>
          <Switch
            checkedChildren={
              <span className="yaymail-setting-switch-label">{__('yes', 'yaymail')}</span>
            }
            checked={globalHeaderSettings?.hidden}
            onChange={handleOnChangeDisplay}
            unCheckedChildren={
              <span className="yaymail-setting-switch-label">{__('no', 'yaymail')}</span>
            }
          />
        </div>
      </div>
      {!globalHeaderSettings?.hidden && (
        <>
          <div
            className={classNames(
              'yaymail-editor-property',
              'yaymail-editor-global-header-override-content',
            )}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'space-between',
              }}
            >
              <div className="yaymail-title" style={{ marginBottom: 0 }}>
                {__('Override content', 'yaymail')}
              </div>
              <Switch
                checkedChildren={
                  <span className="yaymail-setting-switch-label"> {__('on', 'yaymail')} </span>
                }
                checked={globalHeaderSettings?.content_override}
                onChange={handleOnChangeOverride}
                unCheckedChildren={
                  <span className="yaymail-setting-switch-label">{__('off', 'yaymail')}</span>
                }
              />
            </div>
          </div>
          {globalHeaderSettings?.content_override && (
            <div
              className={classNames(
                'yaymail-editor-property',
                'yaymail-editor-global-header-heading',
              )}
            >
              <BaseRichTextEditor
                value={resolveHeadingContent(globalHeaderSettings?.heading_content)}
                id="global_header_heading_content"
                title={__('Email Heading content', 'yaymail')}
                description={__(
                  'This will change the content of all <b>Email Heading elements</b> in Global Header section.',
                  'yaymail',
                )}
                onChange={handleOnChangeContent}
                editorBackgroundColor={headingElement?.data?.background_color}
                editorTextColor={headingElement?.data?.text_color}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
