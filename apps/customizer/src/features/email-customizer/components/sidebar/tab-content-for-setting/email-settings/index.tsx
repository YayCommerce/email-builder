import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { Input } from 'antd';
import { Color } from 'antd/es/color-picker';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import debounce from 'lodash.debounce';

import SaveTemplate from '../../../header/SaveTemplate';
import CustomColorPicker from '../../custom-color-picker';

import './index.scss';
import useTemplateStatus from '@src/hooks/useTemplateStatus';

const PREHEADER_MAX_LENGTH = 150;

const EmailSettings = () => {
  const updateTemplateSettings = useCustomizerPageStore((state) => state.updateTemplateSettings);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const changeContentStatus = useTemplateContentStore((state) => state.changeContentStatus);
  const { isTemplateExist } = useTemplateStatus();

  const showWooEmailFields = useMemo(
    () =>
      isTemplateExist &&
      templateData?.support_status === 'already_supported' &&
      !currentTemplate?.startsWith('pattern_') &&
      currentTemplate !== 'yaymail_global_header_footer',
    [isTemplateExist, templateData?.support_status, currentTemplate],
  );

  const [emailSubject, setEmailSubject] = useState('');

  useEffect(() => {
    if (templateData?.email_subject !== null && templateData?.email_subject !== undefined) {
      setEmailSubject(templateData.email_subject);
    } else {
      setEmailSubject('');
    }
  }, [templateData?.id, templateData?.email_subject]);

  const preheader = templateData?.preheader ?? '';

  const handleChangeEmailSubject = useCallback(
    (value: string) => {
      setEmailSubject(value);
      updateTemplateSettings('email_subject', value);
      changeContentStatus(true);
    },
    [updateTemplateSettings, changeContentStatus],
  );

  const handleChangePreheader = useCallback(
    (value: string) => {
      updateTemplateSettings('preheader', value);
      changeContentStatus(true);
    },
    [updateTemplateSettings, changeContentStatus],
  );
  const changeListBackgroundColor = useTemplateContentStore(
    (state) => state.changeListBackgroundColor,
  );

  const changeListTextColor = useTemplateContentStore((state) => state.changeListTextColor);
  const changeListTitleColor = useTemplateContentStore((state) => state.changeListTitleColor);

  // TODO: trim() return undefined if empty string (still return undefined if undefined/null).
  const backgroundColor = useCustomizerPageStore((state) => {
    const backgroundColorValue = state.templateData?.background_color;
    return backgroundColorValue?.trim() || window.yaymailData.colors.default_background_color;
  });

  const emailContentBackgroundColor = useCustomizerPageStore((state) => {
    const contentBackgroundColorValue = state.templateData?.content_background_color;
    return (
      contentBackgroundColorValue?.trim() ||
      window.yaymailData.colors.default_content_background_color
    );
  });
  const emailContentTextColor = useCustomizerPageStore((state) => {
    const contentTextColorValue = state.templateData?.content_text_color;
    return contentTextColorValue?.trim() || window.yaymailData.colors.default_content_text_color;
  });
  const textLinkColor = useCustomizerPageStore((state) => {
    const textLinkColorValue = state.templateData?.text_link_color;
    return textLinkColorValue?.trim() || window.yaymailData.colors.default_text_link_color;
  });
  const titleColor = useCustomizerPageStore((state) => {
    const titleColorValue = state.templateData?.title_color;
    return titleColorValue?.trim() || window.yaymailData.colors.default_title_color;
  });
  const handleChangeBackgroundColor = useCallback(
    (value: Color) => {
      updateTemplateSettings('background_color', value.toHexString());
      changeContentStatus(true);
    },
    [updateTemplateSettings],
  );
  const handleChangeContentBackgroundColor = useCallback(
    (value: Color) => {
      const hexValue = value.toHexString();
      updateTemplateSettings('content_background_color', hexValue);
      changeListBackgroundColor(hexValue);
      changeContentStatus(true);
    },
    [updateTemplateSettings],
  );
  const handleChangeContentTextColor = useCallback(
    (value: Color) => {
      updateTemplateSettings('content_text_color', value.toHexString());
      changeListTextColor(value.toHexString());
      changeContentStatus(true);
    },
    [updateTemplateSettings],
  );
  const handleChangeTitleColor = useCallback(
    (value: Color) => {
      const hexValue = value.toHexString();
      updateTemplateSettings('title_color', hexValue);
      changeListTitleColor(hexValue);
      changeContentStatus(true);
    },
    [updateTemplateSettings],
  );
  const handleChangeTextLinkColor = useCallback(
    (value: Color) => {
      updateTemplateSettings('text_link_color', value.toHexString());
      changeContentStatus(true);
    },
    [updateTemplateSettings],
  );

  return (
    <>
      <div className="yaymail-customizer-settings__email-settings">
        <div>
          {showWooEmailFields && (
            <>
              <div className="yaymail-general-setting-item yaymail-editor-property">
                <div className="yaymail-title">{__('Email subject', 'yaymail')}</div>
                <Input
                  className="yaymail-custom-input"
                  value={emailSubject}
                  onChange={(e) => handleChangeEmailSubject(e.target.value)}
                  disabled={!isTemplateExist}
                  placeholder={__('Email subject', 'yaymail')}
                  allowClear
                />
                <p className="yaymail-general-setting-item__note">
                  {__(
                    'Using the WooCommerce default subject. Enter a value to override it.',
                    'yaymail',
                  )}
                </p>
              </div>
              <div className="yaymail-general-setting-item yaymail-editor-property">
                <div className="yaymail-title">{__('Pre-header', 'yaymail')}</div>
                <Input
                  className="yaymail-custom-input"
                  value={preheader}
                  onChange={(e) => handleChangePreheader(e.target.value)}
                  disabled={!isTemplateExist}
                  maxLength={PREHEADER_MAX_LENGTH}
                  placeholder={__('Pre-header', 'yaymail')}
                  allowClear
                />
                <p className="yaymail-general-setting-item__note">
                  {__(
                    'Shown as a preview in the inbox, next to the subject line. (Max 150 characters).',
                    'yaymail',
                  )}
                </p>
              </div>
            </>
          )}
          <MemoizedColorSettings
            title={__('Background color', 'yaymail')}
            onChange={handleChangeBackgroundColor}
            value={backgroundColor}
            disabled={!isTemplateExist}
          />
          <MemoizedColorSettings
            title={__('Title color', 'yaymail')}
            onChange={handleChangeTitleColor}
            value={titleColor}
            disabled={!isTemplateExist}
          />
          <MemoizedColorSettings
            title={__('Content background color', 'yaymail')}
            onChange={handleChangeContentBackgroundColor}
            value={emailContentBackgroundColor}
            disabled={!isTemplateExist}
          />
          <MemoizedColorSettings
            title={__('Content text color', 'yaymail')}
            onChange={handleChangeContentTextColor}
            value={emailContentTextColor}
            disabled={!isTemplateExist}
          />
          <MemoizedColorSettings
            title={
              <>
                {__('Text link color', 'yaymail')}
                <p style={{ marginBottom: 2 }} className="yaymail-general-setting-item__note">
                  {__('This will make a change to all elements in this email', 'yaymail')}
                </p>
              </>
            }
            onChange={handleChangeTextLinkColor}
            value={textLinkColor}
            disabled={!isTemplateExist}
          />
        </div>
      </div>
      <div className="yaymail-btn-save-wrapper">
        <SaveTemplate
          hasIcon={false}
          text={__('Save template', 'yaymail')}
          btnClassName="yaymail-btn--light"
          hasLoading
          enableSaveAsTemplate={false}
          disabled={!isTemplateExist}
          style={{
            minWidth: 132,
          }}
        />
      </div>
    </>
  );
};

export default EmailSettings;

function ColorSettings({
  onChange,
  title,
  value,
  disabled,
}: {
  title: ReactNode;
  value: string | undefined;
  // eslint-disable-next-line no-unused-vars
  onChange: (v: Color) => void;
  disabled?: boolean;
}) {
  const handleChange = useCallback(debounce(onChange, 0), [onChange]);
  return (
    <CustomColorPicker title={title} value={value} onChange={handleChange} disabled={disabled} />
  );
}

const MemoizedColorSettings = memo(ColorSettings, (prev, next) => {
  return prev.title === next.title && prev.onChange === next.onChange && prev.value === next.value;
});
