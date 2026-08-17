import { useCallback, useMemo, useState } from 'react';

import { notification, Switch, Tooltip } from 'antd';

import { changeGlobalHeaderFooterStatus } from '@src/common/api/templateApi';
import { getGlobalHeaderFooterEnabledKey, getPlatform } from '@src/common/platform';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { __ } from '@wordpress/i18n';

export default function ToggleGlobalHeaderFooter() {
  const settings = useCustomizerSettingsStore((state) => state.settings);
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });
  const updateSettings = useCustomizerSettingsStore((state) => state.updateSettings);
  const [loading, setLoading] = useState(false);

  const platform = getPlatform();
  const settingKey = getGlobalHeaderFooterEnabledKey();

  const globalHeaderFooterEnabled = useMemo(() => {
    return settings?.[settingKey] ?? false;
  }, [settings, settingKey]);

  const showNotifications = (type: 'success' | 'error', message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const handleChangeGlobalHeaderFooterStatus = useCallback(async (checked: boolean) => {
    setLoading(true);
    const response = await changeGlobalHeaderFooterStatus(checked, platform);
    setLoading(false);
    if (response) {
      setTimeout(() => {
        updateSettings({ [settingKey]: checked });
      }, 10);
      showNotifications(
        'success',
        __('Global header/footer is ', 'yaymail') +
          (checked ? __('enabled', 'yaymail') : __('disabled', 'yaymail')),
      );
    } else {
      showNotifications('error', __('Change status failed', 'yaymail'));
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {notificationsContextHolder}
      <Tooltip
        title={__('%s global header/footer', 'yaymail').replace(
          '%s',
          globalHeaderFooterEnabled ? __('Disable', 'yaymail') : __('Enable', 'yaymail'),
        )}
      >
        <Switch
          id="yaymail-global-header-footer-toggle"
          checked={globalHeaderFooterEnabled}
          onChange={handleChangeGlobalHeaderFooterStatus}
          loading={loading}
        />
      </Tooltip>
    </div>
  );
}
