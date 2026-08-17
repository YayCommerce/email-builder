import { ChangeEvent, useCallback, useMemo } from 'react';

import { Input } from 'antd';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';
import { InputType } from './type';

import './index.scss';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

const TextInput: PropertyBuilderComponentType<InputType> = (props?) => {
  const { value_path, default_value, title, onChange, value, validation_message } = props || {};

  const ensuredValuePath = useMemo(() => value_path ?? 'text', [value_path]);

  const text = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, ensuredValuePath);
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, ensuredValuePath, e.target.value);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, ensuredValuePath, title],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-text">
      <div className="yaymail-title">{__(title ?? 'Text')}</div>
      <Input.TextArea
        className="yaymail-custom-input"
        placeholder={props?.placeholder}
        value={value ?? text ?? default_value}
        onChange={onChange ?? handleOnChange}
        rows={props?.rows}
        autoSize={props?.multiple ? false : { minRows: 1, maxRows: 10 }}
      />
      {Boolean(validation_message) && (
        <p className="yaymail-custom-input-validation-message">{validation_message}</p>
      )}
    </div>
  );
};

export default TextInput;
