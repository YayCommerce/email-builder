import { useCallback } from 'react';

import useTemplateContentStore from '@src/stores/templateContent';

import { PropertyBuilderComponentType } from '../../../types';
import SelectorBase from '../../base/selector-base';
import { SelectorType } from './type';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';
import { __ } from '@wordpress/i18n';

const Selector: PropertyBuilderComponentType<SelectorType> = (props?) => {
  const { value_path, default_value, title, options, ...rest } = props || {};

  if (!value_path) return null;

  const attributeValue = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, value_path ?? '');
  });
  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    (value: string) => {
      if (props?.onChange) {
        props.onChange(value);

        return;
      }
      updateChosenElementData(
        (data) => {
          setValueByPath(data, value_path, value);
        },
        { attribute: props?.title },
      );
    },
    [updateChosenElementData, value_path],
  );

  return (
    <SelectorBase
      onChange={handleOnChange}
      value={attributeValue}
      options={options ?? []}
      defaultValue={default_value}
      title={title ?? __('Select', 'yaymail')}
      {...rest}
    />
  );
};

export default Selector;
