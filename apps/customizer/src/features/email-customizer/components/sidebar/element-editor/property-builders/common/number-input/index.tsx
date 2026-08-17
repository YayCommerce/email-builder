import { useCallback, useEffect, useMemo, useState } from 'react';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import NumberInputBase from '../../base/number-input-base';
import { NumberInputType } from './type';
import debounce from 'lodash.debounce';

const NumberInput: PropertyBuilderComponentType<NumberInputType> = (props?) => {
  const {
    value_path,
    title,
    min,
    max,
    onChange,
    style,
    max_dependency,
    is_debounce,
    debounce_time,
  } = props ?? {};

  if (!value_path) return null;

  const inputNumber = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, value_path);
  });

  const chosenElement = useTemplateContentStore((state) => state.chosenElement);
  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  // Helper function to get dependent value
  const getDependentValue = useCallback((dependencyPath: string, elementData: any) => {
    return getValueByPath(elementData, dependencyPath);
  }, []);

  const [displayValue, setDisplayValue] = useState<number>(inputNumber ?? 0);

  useEffect(() => {
    // Check if there's a max dependency and adjust the current value if needed
    if (max_dependency && chosenElement?.data) {
      const maxValue = getDependentValue(max_dependency, chosenElement.data);
      const currentValue = Number(inputNumber);

      if (currentValue > maxValue) {
        updateChosenElementData(
          (data) => {
            setValueByPath(data, value_path, maxValue);
          },
          { attribute: title },
        );
      }
    }
  }, [
    inputNumber,
    value_path,
    chosenElement?.data,
    max_dependency,
    getDependentValue,
    updateChosenElementData,
    title,
  ]);

  const maxValue = useMemo(() => {
    if (max_dependency && chosenElement?.data) {
      const dependentValue = getDependentValue(max_dependency, chosenElement.data);
      if (dependentValue !== undefined) {
        return dependentValue;
      }
    }

    // Fallback to static max or default
    return max ?? 10;
  }, [max_dependency, chosenElement?.data, getDependentValue, max]);

  const handleOnChange = useCallback(
    (value: number) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, value_path, value);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, title],
  );

  const debounceHandler = useCallback(
    debounce((value: number) => {
      handleOnChange(value);
    }, debounce_time ?? 300),
    [handleOnChange, debounce_time],
  );

  const handleDebounceChange = useCallback(
    (value: number) => {
      setDisplayValue(value);
      debounceHandler(value);
    },
    [debounceHandler],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-number-input">
      <div className="yaymail-title">{__(title ?? 'Number Input')}</div>
      <div className="yaymail-controls-container">
        <NumberInputBase
          style={style ?? { width: '100%' }}
          value={is_debounce ? displayValue : inputNumber ?? 0}
          onChange={is_debounce ? handleDebounceChange : handleOnChange ?? onChange}
          min={min ?? 0}
          max={maxValue}
        />
      </div>
    </div>
  );
};

export default NumberInput;
