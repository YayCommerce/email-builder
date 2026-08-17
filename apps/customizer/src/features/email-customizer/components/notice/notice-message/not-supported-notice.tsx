import { useMemo } from 'react';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import { ReactComponent as NoticeIcon } from '../notice-icon.svg';

const NotSupportedNotice = () => {
  const templateData = useCustomizerPageStore((state) => state.templateData);

  const getCurrentWCEmail = (emails: any) => {
    for (const [key, value] of Object.entries(emails)) {
      if ((value as any)?.id === templateData?.name) {
        return value;
      }
    }
  };

  const get3rdPartyPluginFolderName = (emailInfo: any) => {
    const path = emailInfo?.template_base ?? '';

    if (path.length === 0 || !path.includes('/plugins/')) {
      return '';
    }

    const folderName = path.split('/plugins/');

    if (Array.isArray(folderName) && folderName.length > 0) {
      let _folderName = folderName[1].split('/')[0];
      return _folderName;
    }

    return '';
  };

  const isEmailExistsInSupportedPlugin = useMemo(() => {
    // Retrieve the current WooCommerce email information based on the template data
    const emailInfo = getCurrentWCEmail(window.yaymailData.wc_emails);

    // Extract the plugin folder name from the email information
    const pluginFolderName = get3rdPartyPluginFolderName(emailInfo);

    // Get the list of supported plugins from the global window object
    const supportedPlugins = window.yaymailData.supported_plugins;

    // Iterate through the supported plugins to check if the plugin folder name matches any supported plugin
    for (const [key, value] of Object.entries(supportedPlugins as any)) {
      if (Array.isArray((value as any).slug_name)) {
        for (const sn of (value as any).slug_name) {
          if (sn === pluginFolderName) {
            return { status: true, plugin_name: (value as any).plugin_name };
          }
        }
      }

      if ((value as any).slug_name === pluginFolderName) {
        // If a match is found, return an object indicating the plugin is supported along with the plugin name
        return { status: true, plugin_name: (value as any).plugin_name };
      }
    }

    // If no match is found, return an object indicating the plugin is not supported
    return { status: false, plugin_name: '' };
  }, [templateData]);

  return (
    <div>
      <i className="yaymail-notice-icon">
        <NoticeIcon />
      </i>
      <p>
        <span>{__(' This template is unavailable at the moment. ', 'yaymail')}</span>
        <a
          style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          className="yaymail-link-upgrade"
          href="https://yaycommerce.com/support/"
          target="_blank"
          onClick={(event) => {
            event.stopPropagation();
          }}
          rel="noreferrer"
        >
          {__('Contact us', 'yaymail')}
        </a>
        <span>{__(' to see if it can be customized with ', 'yaymail')}</span>
        <a
          style={{ fontWeight: 'bold', textDecoration: 'underline' }}
          className="yaymail-link-upgrade"
          href="https://yaycommerce.com/yaymail-addons/"
          target="_blank"
          onClick={(event) => {
            event.stopPropagation();
          }}
          rel="noreferrer"
        >
          {__('YayMail Addon.', 'yaymail')}
        </a>
        {isEmailExistsInSupportedPlugin.status && (
          <>
            <br />
            <span>
              {__(`We already support several other emails for %s plugin.`, 'yaymail').replace(
                '%s',
                isEmailExistsInSupportedPlugin
                  ? isEmailExistsInSupportedPlugin?.plugin_name
                  : 'this',
              )}
            </span>
            <span>{__('Please contact us to request features.', 'yaymail')}</span>
          </>
        )}
      </p>
    </div>
  );
};

export default NotSupportedNotice;
