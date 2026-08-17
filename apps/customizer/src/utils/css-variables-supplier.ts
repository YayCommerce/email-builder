import { isWpPlatform } from '@src/common/platform';
import CSS_VARIABLES from '@src/constants/tokens';

// WordPress admin default colors (used when only WP customizer is active)
const WP_PRIMARY_COLOR = '#3858e9';
const WP_PRIMARY_DARK_COLOR = '#7b90ff';

// window.yaymailData is inlined by PHP (wp_localize_script) before this module loads,
// so we can read it and set CSS variables immediately — no need to wait for DOMContentLoaded.
const vars = flattenObject(CSS_VARIABLES, '--yaymail');

if (isWpPlatform()) {
  vars['--yaymail-color-wcPurple-default'] = WP_PRIMARY_COLOR;
  vars['--yaymail-color-wcPurple-dark'] = WP_PRIMARY_DARK_COLOR;
}

Object.entries(vars).forEach(([key, value]) => {
  document.documentElement.style.setProperty(key, value);
});

/**
 * Flattens a nested object into a single-level object by creating key-value pairs for each value.
 *
 * @param obj - The nested object to be flattened.
 * @param prefix - Optional prefix to be appended to the keys of the flattened object.
 * @returns A new object with flattened key-value pairs.
 */
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((result: Record<string, any>, key: string) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'object' && value !== null) {
      const flattened = flattenObject(value, newKey);
      Object.assign(result, flattened);
    } else {
      result[newKey] = value;
    }

    return result;
  }, {});
}
