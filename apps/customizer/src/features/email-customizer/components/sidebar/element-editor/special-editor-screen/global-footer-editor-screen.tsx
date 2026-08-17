import { useCallback, useMemo } from 'react';

import { Switch } from 'antd';

import BaseRichTextEditor from '@src/components/base-rich-text-editor';

import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import { isWpPlatform } from '@src/common/platform';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import { findFirstElementByType } from './find-first-element-by-type';
import useGlobalHeaderFooterNavigation from './useNavigate';

const WP_DEFAULT_FOOTER_CONTENT =
  '<p style="font-size: 14px;margin: 0px 0px 16px; text-align: center;">[yaymail_site_name]</p>';

const WC_DEFAULT_FOOTER_CONTENT =
  '<p style="font-size: 14px; margin: 0px 0px 16px; text-align: center;">[yaymail_site_name] - Built with <a style="color: #873eff; font-weight: normal; text-decoration: underline;" href="https://woocommerce.com" target="_blank" rel="noopener">WooCommerce</a></p>';

const resolveFooterContent = (storedContent: string | undefined): string => {
  if (!isWpPlatform()) return storedContent || WC_DEFAULT_FOOTER_CONTENT;
  // On WP platform: use WP default if content is empty or still contains the WooCommerce link
  if (!storedContent || storedContent.includes('woocommerce.com')) {
    return WP_DEFAULT_FOOTER_CONTENT;
  }
  return storedContent;
};

export const DEFAULT_GLOBAL_FOOTER_SETTINGS = {
  content_override: false,
  footer_content: '',
  hidden: false,
};

export default function GlobalFooterEditorScreen() {
  const globalFooterSettings = useCustomizerPageStore(
    (state) => state.templateData?.global_footer_settings,
  );
  const updateTemplateSettingsObject = useCustomizerPageStore(
    (state) => state.updateTemplateSettingsObject,
  );
  const hideTemplateGlobalFooter = useCustomizerPageStore(
    (state) => state.hideTemplateGlobalFooter,
  );
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);
  const globalFooterElements = useCustomizerPageStore(
    (state) => state.globalHeaderFooter.globalFooterElements,
  );
  const footerElement = useMemo(
    () => findFirstElementByType<'footer'>(globalFooterElements, 'footer'),
    [globalFooterElements],
  );
  const navigateAction = useGlobalHeaderFooterNavigation();
  const handleOnChangeContent = useCallback((value: string) => {
    updateTemplateSettingsObject((state: any) => {
      if (state.templateData?.global_footer_settings) {
        state.templateData.global_footer_settings.footer_content = value;
      } else {
        state.templateData.global_footer_settings = {
          ...DEFAULT_GLOBAL_FOOTER_SETTINGS,
          footer_content: value,
        };
      }
    });
    changeContentStatus(true);
  }, []);
  const handleOnChangeOverride = useCallback((value: boolean) => {
    updateTemplateSettingsObject((state: any) => {
      const settings = state.templateData?.global_footer_settings;
      const currentContent = settings?.footer_content;
      // When enabling override on WP platform, replace WooCommerce default with WP default
      const resolvedContent =
        value ? resolveFooterContent(currentContent) : (currentContent ?? '');
      if (settings) {
        settings.content_override = value;
        settings.footer_content = resolvedContent;
      } else {
        state.templateData.global_footer_settings = {
          ...DEFAULT_GLOBAL_FOOTER_SETTINGS,
          content_override: value,
          footer_content: resolvedContent,
        };
      }
    });
    changeContentStatus(true);
  }, []);
  const handleOnChangeDisplay = useCallback((value: boolean) => {
    hideTemplateGlobalFooter(value);
    changeContentStatus(true);
  }, []);
  return (
    <div>
      <div className={classNames('yaymail-editor-property', 'yaymail-editor-global-footer-link')}>
        <div className="yaymail-title">
          {__(`This is the Global footer element, you can customize it by go to `, 'yaymail')}
          <a onClick={navigateAction}>{__('Global footer', 'yaymail')}</a>
        </div>
      </div>
      <div
        className={classNames('yaymail-editor-property', 'yaymail-editor-global-footer-display')}
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
            checked={globalFooterSettings?.hidden}
            onChange={handleOnChangeDisplay}
            unCheckedChildren={
              <span className="yaymail-setting-switch-label">{__('no', 'yaymail')}</span>
            }
          />
        </div>
      </div>
      {!globalFooterSettings?.hidden && (
        <>
          <div
            className={classNames(
              'yaymail-editor-property',
              'yaymail-editor-global-footer-override-content',
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
                checked={globalFooterSettings?.content_override}
                onChange={handleOnChangeOverride}
                unCheckedChildren={
                  <span className="yaymail-setting-switch-label">{__('off', 'yaymail')}</span>
                }
              />
            </div>
          </div>
          {globalFooterSettings?.content_override && (
            <div
              className={classNames(
                'yaymail-editor-property',
                'yaymail-editor-global-footer-footer',
              )}
            >
              <BaseRichTextEditor
                value={resolveFooterContent(globalFooterSettings?.footer_content)}
                id="global_footer_footer_content"
                title={__('Footer content', 'yaymail')}
                description={__(
                  'This will change the content of all <b>Footer elements</b> in Global Footer section.',
                  'yaymail',
                )}
                onChange={handleOnChangeContent}
                editorBackgroundColor={footerElement?.data?.background_color}
                editorTextColor={footerElement?.data?.text_color}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
