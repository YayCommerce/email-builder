import { useCallback, useMemo, useState } from 'react';
import AceEditor from 'react-ace';
import { useLocation } from 'react-router-dom';

import { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, InputNumber, notification, Select, Switch } from 'antd';
import { IconType } from 'antd/es/notification/interface';

import useSettingsQueries from '@src/hooks/queries/useSettingsQueries';
import { useDirection } from '@src/hooks/useDirection';

import { getGlobalHeaderFooterEnabledKey, isWpPlatform } from '@src/common/platform';
import { GLOBAL_HEADER_FOOTER_TEMPLATE_IDS } from '@src/constants/global-header-footer';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { isString } from '@src/utils';
import { __ } from '@wordpress/i18n';
import { isDefined } from '@yaymail/utilities/src/functions';

import { IGeneralSettingData } from '../../type';

import './index.scss';
import 'ace-builds/src-noconflict/mode-css';

import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-rtl';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/ext-beautify';

type NotificationType = IconType;

type SwitchableAttributes = Partial<
  Pick<
    IGeneralSettingData,
    | 'direction'
    | 'show_product_image'
    | 'show_product_sku'
    | 'show_product_description'
    | 'show_product_hyper_links'
    | 'show_product_regular_price'
    | 'show_product_item_cost'
    | 'enable_custom_css'
    | 'global_header_footer_enabled'
    | 'wp_global_header_footer_enabled'
  >
>;
type updateDataCallbackType = (
  // eslint-disable-next-line no-unused-vars
  data: SwitchableAttributes,
) => void;

const EmailSettingSwitch = (props: {
  attribute: keyof SwitchableAttributes;
  updateDataCallback: updateDataCallbackType;
  label: string;
  checkedValue?: string;
  uncheckedValue?: string;
  value?: boolean | string;
  disabled?: boolean;
  note?: string;
}) => {
  const value: boolean = useMemo(() => {
    if (!props.value) return false;
    if (isString(props.value)) {
      return props.checkedValue === props.value;
    }
    return true;
  }, [props.value, props.checkedValue, props.uncheckedValue]);

  const handleChange = useCallback(
    (checked: boolean) => {
      const newValue = checked
        ? isDefined(props.checkedValue)
          ? props.checkedValue
          : true
        : isDefined(props.uncheckedValue)
        ? props.uncheckedValue
        : false;

      props.updateDataCallback({ [props.attribute]: newValue });
    },
    [props.updateDataCallback],
  );

  return (
    <div className="yaymail-general-setting-item horizontal">
      <div className="yaymail-general-setting-item__title">
        <span>{props.label}</span>
        {props.note && <span className="yaymail-general-setting-item__note">{props.note}</span>}
      </div>
      <Switch
        checkedChildren={
          <span className="yaymail-setting-switch-label">
            {isDefined(props.checkedValue) ? props.checkedValue : 'on'}
          </span>
        }
        checked={value}
        onChange={handleChange}
        unCheckedChildren={
          <span className="yaymail-setting-switch-label">
            {isDefined(props.uncheckedValue) ? props.uncheckedValue : 'off'}
          </span>
        }
        disabled={props.disabled}
      />
    </div>
  );
};

const URL_CHANGE_EMAIL_SUBJECT_AND_FORM_NAME =
  window.yaymailData.urls.home_url + '/wp-admin/admin.php?page=wc-settings&tab=email';

const GlobalSettings = () => {
  const direction = useDirection();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const template = queryParams.get('template');

  const updateSettings = useCustomizerSettingsStore((state) => state.updateSettings);
  const { saveSettingsMutation } = useSettingsQueries({ fetch: false });
  const settings = useCustomizerSettingsStore((state) => state.settings);

  const isGlobalHeaderFooterPage = useMemo(
    () => GLOBAL_HEADER_FOOTER_TEMPLATE_IDS.includes(template || ''),
    [template],
  );

  const globalHeaderFooterSettingKey = getGlobalHeaderFooterEnabledKey();

  const hasChanged = useCustomizerSettingsStore((state) => state.hasChanged);
  const updateSettingsStatus = useCustomizerSettingsStore((state) => state.updateSettingsStatus);

  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateSettings = (data: any) => {
    updateSettings(data);
    updateSettingsStatus(true);
  };
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const containerWidth = useMemo(() => {
    if (!settings || !settings.container_width || isNaN(settings.container_width)) {
      return 605;
    }
    return settings?.container_width;
  }, [settings]);

  const onContainerWidthChange = useCallback(
    (value: number | string | null) => {
      if (typeof value !== 'number') return;
      handleUpdateSettings({ container_width: value });
    },
    [handleUpdateSettings],
  );

  const onPaymentDisplayModeChange = useCallback(
    (value: string) => {
      handleUpdateSettings({
        payment_display_mode: value as IGeneralSettingData['payment_display_mode'],
      });
    },
    [handleUpdateSettings],
  );

  const onProductImagePositionChange = useCallback(
    (value: string) => {
      handleUpdateSettings({
        product_image_position: value as IGeneralSettingData['product_image_position'],
      });
    },
    [handleUpdateSettings],
  );

  const onImageHeightChange = useCallback(
    (value: number | string | null) => {
      if (typeof value !== 'number') return;
      handleUpdateSettings({ product_image_height: value });
    },
    [handleUpdateSettings],
  );

  const onImageWidthChange = useCallback(
    (value: number | string | null) => {
      if (typeof value !== 'number') return;
      handleUpdateSettings({ product_image_width: value });
    },
    [handleUpdateSettings],
  );

  const onCustomCssChange = useCallback(
    (value: string | undefined) => {
      if (!isDefined(value)) return;
      handleUpdateSettings({ custom_css: value });
    },
    [handleUpdateSettings],
  );

  const handleSaveSettings = async () => {
    setIsSaving(true);
    const response = await saveSettingsMutation.mutateAsync(settings as IGeneralSettingData);
    if (response.success) {
      showNotifications('success', __('Save success', 'yaymail'));
    } else {
      showNotifications('error', __('Save failed', 'yaymail'));
    }
    setIsSaving(false);
  };

  return (
    <>
      {notificationsContextHolder}
      {settings && (
        <div className="yaymail-general-setting">
          <EmailSettingSwitch
            attribute="direction"
            checkedValue="rtl"
            label={__('Direction', 'yaymail')}
            value={direction}
            uncheckedValue="ltr"
            updateDataCallback={handleUpdateSettings}
          />
          {!isGlobalHeaderFooterPage && (
            <EmailSettingSwitch
              value={Boolean(settings[globalHeaderFooterSettingKey] ?? false)}
              attribute={globalHeaderFooterSettingKey}
              updateDataCallback={handleUpdateSettings}
              label={__('Global header footer', 'yaymail')}
            />
          )}
          <div className="yaymail-general-setting-item">
            <div className="yaymail-general-setting-item__title">
              {__('Container width (px)', 'yaymail')}
            </div>
            <InputNumber
              className="vertical-control"
              bordered={false}
              min={480}
              max={900}
              defaultValue={605}
              value={containerWidth}
              onChange={onContainerWidthChange}
            />
            <p className="yaymail-general-setting-item__note">
              {__('Email width must be 480px (min) - 900px (max)', 'yaymail')}
            </p>
          </div>
          {!isWpPlatform() && (
            <>
              <div className="yaymail-general-setting-item">
                <div className="yaymail-general-setting-item__disabled" style={{ opacity: 0.5 }}>
                  <div className="yaymail-general-setting-item__title">
                    {__('Display payment instruction and details', 'yaymail')}
                  </div>
                  <Select
                    className="vertical-control"
                    defaultValue="onlyForCustomer"
                    value={settings.payment_display_mode as string}
                    onChange={onPaymentDisplayModeChange}
                    popupClassName="yaymail-sidebar-select-popup"
                    disabled
                  >
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                      { value: 'customer', label: 'Only for customer' },
                    ].map((e) => (
                      <Select.Option key={e.value} value={e.value} label={e.label}>
                        <div className="yaymail-sidebar-custom-select-option">
                          <span>{e.label}</span>
                          <CheckOutlined className="check" />
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <p className="yaymail-general-setting-item__note">
                  {__(
                    'This setting is no longer global. To show payment instructions, please use [yaymail_payment_instructions] in any text area',
                    'yaymail',
                  )}
                </p>
              </div>
              <EmailSettingSwitch
                value={Boolean(settings.show_product_image)}
                attribute="show_product_image"
                updateDataCallback={handleUpdateSettings}
                label={__('Show product image', 'yaymail')}
              />

              {Boolean(settings.show_product_image) && (
                <div>
                  <div className="yaymail-general-setting-item">
                    <div className="yaymail-general-setting-item__title">
                      {__('Product image position', 'yaymail')}
                    </div>
                    <Select
                      className="vertical-control"
                      defaultValue="onlyForCustomer"
                      value={settings.product_image_position as string}
                      onChange={onProductImagePositionChange}
                      popupClassName="yaymail-sidebar-select-popup"
                    >
                      {[
                        { value: 'top', label: 'Top' },
                        { value: 'left', label: 'Left' },
                        { value: 'bottom', label: 'Bottom' },
                      ].map((e) => (
                        <Select.Option key={e.value} value={e.value} label={e.label}>
                          <div className="yaymail-sidebar-custom-select-option">
                            <span>{e.label}</span>
                            <CheckOutlined className="check" />
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>

                  <div className="yaymail-general-setting-item">
                    <div className="yaymail-general-setting-item__title">
                      {__('Product image height (px)', 'yaymail')}
                    </div>
                    <InputNumber
                      className="vertical-control"
                      bordered={false}
                      min={30}
                      max={300}
                      defaultValue={30}
                      value={settings.product_image_height}
                      onChange={onImageHeightChange}
                    />
                    <p className="yaymail-general-setting-item__note">
                      {__('Image height must be 30px (min) - 300px (max)', 'yaymail')}
                    </p>
                  </div>

                  <div className="yaymail-general-setting-item">
                    <div className="yaymail-general-setting-item__title">
                      {__('Image width (px)', 'yaymail')}
                    </div>
                    <InputNumber
                      className="vertical-control"
                      bordered={false}
                      min={30}
                      max={300}
                      defaultValue={30}
                      value={settings.product_image_width}
                      onChange={onImageWidthChange}
                    />
                    <p className="yaymail-general-setting-item__note">
                      {__('Product image width must be 30px (min) - 300px (max)', 'yaymail')}
                    </p>
                  </div>
                </div>
              )}

              <EmailSettingSwitch
                value={Boolean(settings.show_product_sku)}
                attribute="show_product_sku"
                updateDataCallback={handleUpdateSettings}
                label={__('Show product SKU', 'yaymail')}
              />

              <EmailSettingSwitch
                value={Boolean(settings.show_product_description)}
                attribute="show_product_description"
                updateDataCallback={handleUpdateSettings}
                label={__('Show product short description', 'yaymail')}
              />

              <EmailSettingSwitch
                value={Boolean(settings.show_product_hyper_links)}
                attribute="show_product_hyper_links"
                updateDataCallback={handleUpdateSettings}
                label={__('Show product Hyperlinks', 'yaymail')}
              />

              <EmailSettingSwitch
                value={Boolean(settings.show_product_item_cost)}
                attribute="show_product_item_cost"
                updateDataCallback={handleUpdateSettings}
                label={__('Show product item cost', 'yaymail')}
              />

              <EmailSettingSwitch
                value={Boolean(settings.show_product_regular_price)}
                attribute="show_product_regular_price"
                updateDataCallback={handleUpdateSettings}
                label={__('Show product regular price', 'yaymail')}
              />
            </>
          )}

          <EmailSettingSwitch
            value={Boolean(settings.enable_custom_css)}
            attribute="enable_custom_css"
            updateDataCallback={handleUpdateSettings}
            label={__('Use custom CSS', 'yaymail')}
          />

          {Boolean(settings.enable_custom_css) && (
            <AceEditor
              mode="css"
              theme="dracula"
              onChange={onCustomCssChange}
              name="yaymail-custom-css"
              height="270px"
              width="268px"
              enableLiveAutocompletion
              enableBasicAutocompletion
              enableMobileMenu
              tabSize={2}
              editorProps={{ $blockScrolling: true }}
              className="yaymail-custom-css-editor"
              showGutter
              showPrintMargin
              highlightActiveLine
              value={settings.custom_css}
              setOptions={{
                useWorker: false,
              }}
            />
          )}

          {!isWpPlatform() && (
            <div className="yaymail-general-setting-item" style={{ marginBottom: 0 }}>
              <div
                className="yaymail-general-setting-item__title"
                style={{ textTransform: 'initial' }}
              >
                {__('Change email subject and form name', 'yaymail')}
              </div>
              <a
                target="_blank"
                href={URL_CHANGE_EMAIL_SUBJECT_AND_FORM_NAME}
                style={{ fontSize: 12, fontWeight: 500 }}
                rel="noreferrer"
                className="yaymail-link--light"
              >
                {__('Click here', 'yaymail')}
              </a>
            </div>
          )}
        </div>
      )}
      <div className="yaymail-btn-save-wrapper">
        <Button
          type="primary"
          className="yaymail-btn-save yaymail-btn--light"
          onClick={handleSaveSettings}
          disabled={!hasChanged}
          loading={isSaving}
          icon={isSaving ? <LoadingOutlined /> : undefined}
          style={{ minWidth: 165 }}
        >
          {isSaving ? __('Saving...', 'yaymail') : __('Save global settings', 'yaymail')}
        </Button>
      </div>
    </>
  );
};

// TODO: implement checking change to enable save button
// TODO: Add popup to edit CSS in larger view

export default GlobalSettings;
