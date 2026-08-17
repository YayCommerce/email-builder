import { IElement } from '@src/features/email-customizer';
// eslint-disable-next-line no-restricted-imports
import { isDefined } from '@src/utils';

export const getProperty = (
  data: IElement['data'],
  attribute: string,
  fallback?: unknown,
): unknown => {
  const fallbackResult = fallback ?? null;

  if (!attribute) return fallbackResult;
  if (isDefined(data, attribute)) return (data as any)[attribute];
  return fallbackResult;
};

/**
 * @deprecated
 * Use import {getValueByPath} from '@yaymail/utilities/src/functions'
 */
export const getValueByPath = <TReturn = any>(data: any, path: string) => {
  if (path == null) {
    return undefined;
  }

  const attributeLevels = path.split('.');

  return attributeLevels.reduce((currentLevel, attr) => {
    return currentLevel?.[attr];
  }, data) as TReturn;
};

/**
 * @deprecated
 * Use import {setValueByPath} from '@yaymail/utilities/src/functions'
 */
export const setValueByPath = (data: any, path: string, value: any) => {
  if (path == null) {
    return;
  }

  const attributeLevels = path.split('.');

  attributeLevels.reduce((currentLevel, attr, index) => {
    const isLastLevel = index === attributeLevels.length - 1;

    if (isLastLevel) {
      currentLevel[attr] = value;
      return currentLevel;
    }

    if (currentLevel[attr] === undefined || currentLevel[attr] === null) {
      currentLevel[attr] = {};
    }
    return currentLevel[attr];
  }, data);
};

export const resolvePresetColorValues = (data: any, globalVariables: any): any => {
  const preset_path_regex = /presets\/[^\/]+\/[^\/]+\/\d+/g;

  // Strings: replace all preset path occurrences inline
  if (typeof data === 'string') {
    if (!data.includes('presets/')) return data;
    return data.replace(preset_path_regex, (match) => {
      const parts = match.split('/');
      // Expected: [ 'presets', presetId, presetName, index ]
      if (parts.length < 4 || parts[0] !== 'presets') return match;
      const presetId = parts[1];
      const colorIndex = Number.parseInt(parts[3], 10);
      const preset = globalVariables?.colors?.[presetId];
      const color = Number.isNaN(colorIndex) ? undefined : preset?.presetColors?.[colorIndex];
      return color?.colorValue ?? match;
    });
  }

  // Arrays: map recursively
  if (Array.isArray(data)) {
    return data.map((item) => resolvePresetColorValues(item, globalVariables));
  }

  // Objects: recurse keys; leave nulls and non-objects as-is
  if (data !== null && typeof data === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = resolvePresetColorValues(value, globalVariables);
    }
    return result;
  }

  // Primitives (number, boolean, undefined, null)
  return data;
};

export const getColorNameByPath = (path: string, colors: any) => {
  if (typeof path !== 'string' || !path.includes('/')) return '';
  const pathParts = path.split('/');
  const presetID = pathParts[1];
  const colorIndex = parseInt(pathParts[3], 10);
  const colorName = colors?.[presetID]?.presetColors?.[colorIndex].colorName ?? '';
  return colorName;
};
