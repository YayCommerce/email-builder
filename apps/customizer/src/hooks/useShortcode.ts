import { useCallback } from 'react';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { replacePlaceholders } from '@yaymail/utilities/src/functions';

const SHORTCODE_REGEX = /\[yaymail_[^\]]*\]/;
const SHORTCODE_NAME_REGEX = /\[(yaymail_[_\w:]+)[\s\]]/;
const ATTRIBUTES_REGEX = /([^= ]+)=("[^"]*")/g;

function getShortcodeName(str: string) {
  const matchingNames = str.match(SHORTCODE_NAME_REGEX);
  const result = (matchingNames && matchingNames[1]) || null;
  return result;
}

export function getShortcodeAttributes(str: string) {
  const matchingPatterns = str.match(ATTRIBUTES_REGEX);

  if (null == matchingPatterns) {
    return {};
  }

  const result = matchingPatterns
    .filter(isValidateAttribute)
    .map(mapPatternToAttribute)
    .reduce((accumulator, currentObject) => ({ ...accumulator, ...currentObject }), {});

  return result;
}

// eslint-disable-next-line no-unused-vars
function isValidateAttribute(pattern: string) {
  return true;
}

function mapPatternToAttribute(pattern: string) {
  const matchingAttributeNames = pattern.match(/([^\s]*)="/);
  const matchingAttributeValues = pattern.match(/"([^"]*)"/);

  return {
    [(matchingAttributeNames && matchingAttributeNames[1]) || '']:
      (matchingAttributeValues && matchingAttributeValues[1]) || '',
  };
}

function parseShortcode(str: string) {
  return {
    name: getShortcodeName(str),
    attributes: getShortcodeAttributes(str),
  };
}

export default function useShortcode() {
  const shortcodes = useCustomizerPageStore((state) => state.shortcodes);
  const doShortcode = useCallback(
    (str: string) => {
      if (!str) {
        return '';
      }
      const foundShortcodes = str.match(new RegExp(SHORTCODE_REGEX, 'g'));
      if (foundShortcodes == null) {
        return str;
      }

      // TODO: replace when shortcode return empty

      // TODO: Shortcode in shortcode
      foundShortcodes.forEach((shortcode) => {
        const parsedShortcode = parseShortcode(shortcode);
        const matchingShortcode = (shortcodes ?? []).find(
          (shortcodeInformation) => parsedShortcode.name === shortcodeInformation.name,
        );

        if (matchingShortcode) {
          let shortcodeContent = matchingShortcode.content;

          // TODO: Temp comment for testing shortcode with prefilled attributes
          // const shortcodeAttributesObj = Object.entries(matchingShortcode.attributes ?? {}).reduce(
          //   (prev, [key, value]) => {
          //     if (!(key in parsedShortcode.attributes)) {
          //       parsedShortcode.attributes[key] = value;
          //     }
          //     return prev;
          //   },
          //   parsedShortcode.attributes,
          // );

          const shortcodeAttributesObj = parsedShortcode.attributes;

          if (!Array.isArray(shortcodeAttributesObj)) {
            // Remove <a> tags and keep only the content when is_plain is true
            if (shortcodeAttributesObj?.is_plain === 'true') {
              shortcodeContent = shortcodeContent.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1');
            }

            shortcodeContent = replacePlaceholders(shortcodeContent, shortcodeAttributesObj);
          }

          str = str.replaceAll(shortcode, shortcodeContent);
        }
      });
      return str;
    },
    [shortcodes],
  );
  return { doShortcode };
}
