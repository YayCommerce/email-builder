import { useCallback, useMemo } from 'react';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType, PropertyBuilderPropType } from '../../../types';
import { TextFormatTogglesFormatDefaults, TextFormatTogglesType } from './type';

import './index.scss';

/**
 * Coerce stored flag to boolean (handles string "false"/"true" from JSON/API).
 */
function coerceFormatFlag(value: unknown, whenUnset: boolean): boolean {
  if (value === undefined || value === null) {
    return whenUnset;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    const s = value.trim().toLowerCase();
    if (s === 'true' || s === '1' || s === 'yes' || s === 'on') {
      return true;
    }
    if (s === 'false' || s === '0' || s === 'no' || s === 'off' || s === '') {
      return false;
    }
  }
  return Boolean(value);
}

function pathsFromRoot(root: string | undefined) {
  const base = root?.replace(/\.$/, '')?.trim();
  if (!base) {
    return null;
  }
  return {
    bold: `${base}.bold`,
    italic: `${base}.italic`,
    underline: `${base}.underline`,
  };
}

function readFormatFlag(data: unknown, path: string | undefined, whenUnset: boolean): boolean {
  if (!path) {
    return whenUnset;
  }
  return coerceFormatFlag(getValueByPath(data, path), whenUnset);
}

const TextFormatToggles: PropertyBuilderComponentType<TextFormatTogglesType> = (props) => {
  const {
    title,
    value_path: valuePathRoot,
    bold_value_path: boldPathProp,
    italic_value_path: italicPathProp,
    underline_value_path: underlinePathProp,
    default_value: defaultValueProp,
  } = (props ?? {}) as PropertyBuilderPropType<TextFormatTogglesType>;

  const defaults: TextFormatTogglesFormatDefaults = defaultValueProp ?? {};

  const derived = pathsFromRoot(valuePathRoot as string | undefined);
  if (!derived) {
    return null;
  }

  const boldPath = boldPathProp ?? derived.bold;
  const italicPath = italicPathProp ?? derived.italic;
  const underlinePath = underlinePathProp ?? derived.underline;

  const defaultBold = defaults.bold ?? false;
  const defaultItalic = defaults.italic ?? true;
  const defaultUnderline = defaults.underline ?? false;

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const bold = useTemplateContentStore((state) =>
    readFormatFlag(state.chosenElement?.data, boldPath, defaultBold),
  );
  const italic = useTemplateContentStore((state) =>
    readFormatFlag(state.chosenElement?.data, italicPath, defaultItalic),
  );
  const underline = useTemplateContentStore((state) =>
    readFormatFlag(state.chosenElement?.data, underlinePath, defaultUnderline),
  );

  const toggle = useCallback(
    (path: string, current: boolean) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, path, !current);
        },
        { attribute: title ?? __('Text format', 'yaymail') },
      );
    },
    [updateChosenElementData, title],
  );

  const handleBold = useCallback(() => {
    toggle(boldPath, bold);
  }, [boldPath, bold, toggle]);

  const handleItalic = useCallback(() => {
    toggle(italicPath, italic);
  }, [italicPath, italic, toggle]);

  const handleUnderline = useCallback(() => {
    toggle(underlinePath, underline);
  }, [underlinePath, underline, toggle]);

  const labelId = useMemo(
    () => `yaymail-text-format-${boldPath}-${italicPath}-${underlinePath}`,
    [boldPath, italicPath, underlinePath],
  );

  const isBoldActive = useMemo(() => coerceFormatFlag(bold, defaultBold), [bold]);
  const isItalicActive = useMemo(() => coerceFormatFlag(italic, defaultItalic), [italic]);
  const isUnderlineActive = useMemo(() => coerceFormatFlag(underline, defaultUnderline), [underline]);

  return (
    <div className="yaymail-editor-property yaymail-editor-property-text-format-toggles">
      <div className="yaymail-title" id={labelId}>
        {__(title ?? 'Text formatting', 'yaymail')}
      </div>
      <div
        className="yaymail-controls-container yaymail-text-format-toggles"
        role="group"
        aria-labelledby={labelId}
      >
        <button
          type="button"
          className={`yaymail-text-format-toggles__btn${isBoldActive ? ' is-active' : ''}`}
          aria-pressed={isBoldActive}
          onClick={handleBold}
        >
          <span className="yaymail-text-format-toggles__label yaymail-text-format-toggles__label--bold">
            B
          </span>
        </button>
        <button
          type="button"
          className={`yaymail-text-format-toggles__btn${isItalicActive ? ' is-active' : ''}`}
          aria-pressed={isItalicActive}
          onClick={handleItalic}
        >
          <span className="yaymail-text-format-toggles__label yaymail-text-format-toggles__label--italic">
            I
          </span>
        </button>
        <button
          type="button"
          className={`yaymail-text-format-toggles__btn${isUnderlineActive ? ' is-active' : ''}`}
          aria-pressed={isUnderlineActive}
          onClick={handleUnderline}
        >
          <span className="yaymail-text-format-toggles__label yaymail-text-format-toggles__label--underline">
            U
          </span>
        </button>
      </div>
    </div>
  );
};

export default TextFormatToggles;
