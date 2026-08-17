import { useCallback, useMemo } from 'react';

import { DimensionType } from '@src/features/email-customizer';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, isDefined, setValueByPath } from '@yaymail/utilities/src/functions';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { PropertyBuilderComponentType } from '../../../types';
import CustomSlider from '../../base/custom-slider';

const Dimension: PropertyBuilderComponentType<DimensionType> = (props?) => {
  const containerWidth = useCustomizerSettingsStore((state) => state.settings?.container_width);
  const { value_path, unit } = props || {};
  const ensuredValuePath = value_path || 'width';

  const min = useMemo(() => props?.min ?? 0, [props?.min]);
  const max = useMemo(() => props?.max ?? containerWidth ?? 605, [props?.max]);
  const defaultValue = useMemo(
    () => props?.default_value ?? props?.max ?? 172,
    [props?.default_value, props?.max],
  );

  const dimension = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const numericValue = useMemo(() => {
    return convertDimensionValueToNumber(dimension ?? defaultValue);
  }, [dimension, defaultValue]);

  const title = useMemo(() => props?.title ?? __('Dimension', 'yaymail'), []);

  const dimensionPathClass = useMemo(
    () => `yaymail-dimension--${ensuredValuePath}`,
    [ensuredValuePath],
  );

  const handleOnChange = useCallback(
    debounce((value: any) => {
      if (typeof value !== 'number') return;
      updateChosenElementData(
        (data) => {
          setValueByPath(data, ensuredValuePath, value);
        },
        { attribute: title },
      );
    }, 0),
    [updateChosenElementData, ensuredValuePath],
  );

  const displayUnit = useMemo(() => unit ?? 'px', [unit]);

  return (
    <CustomSlider
      className={classNames('yaymail-editor-property-width', dimensionPathClass)}
      title={title}
      value={numericValue}
      displayUnit={displayUnit}
      min={min}
      max={max}
      onChange={handleOnChange}
    />
  );
};

function convertDimensionValueToNumber(value: string | number | undefined): number {
  if (!isDefined(value)) return 0;
  if (typeof value === 'number') return value;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return 0;
  }
  return numericValue;
}

export default Dimension;
