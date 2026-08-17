import { useCallback } from 'react';

import { Radio, RadioChangeEvent } from 'antd';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';

import './index.scss';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

const SelectNumber: PropertyBuilderComponentType<any> = (props?) => {
  const valuePath = props.value_path || 'number_column';
  const number = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, valuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    (e: RadioChangeEvent) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, e.target.value);
        },
        { attribute: props.title ?? __('Select number column', 'yaymail') },
      );
    },
    [updateChosenElementData, valuePath],
  );

  const { title } = props || {};

  return (
    <div className="yaymail-editor-property yaymail-editor-property-select-number">
      <div className="yaymail-title">{__(title ?? 'Select number column')}</div>
      <div className="yaymail-controls-container">
        <Radio.Group
          defaultValue="two"
          size="large"
          className="yaymail-select-number-radio-group"
          value={+number}
          onChange={handleOnChange}
        >
          <Radio.Button value={1} className="yaymail-select-number-radio-group-option">
            <span>1</span>
          </Radio.Button>
          <Radio.Button value={2} className="yaymail-select-number-radio-group-option">
            <span>2</span>
          </Radio.Button>
          <Radio.Button value={3} className="yaymail-select-number-radio-group-option">
            <span>3</span>
          </Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
};

export default SelectNumber;
