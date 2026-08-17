import { setLocaleData as setLocaleDataWordpress } from '@wordpress/i18n';

/**
 * Sets locale data for translations
 */
export const setLocaleData = (): void => {
  const localeData = window.yaymailData.i18n.locale_data.messages;

  if (localeData) {
    setLocaleDataWordpress(localeData, 'yaymail');
  }
};
