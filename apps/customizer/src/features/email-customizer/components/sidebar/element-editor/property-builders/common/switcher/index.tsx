import { ChangeEvent, useCallback, useMemo } from 'react';

import { Input, Switch } from 'antd';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';

import { SwitcherType } from './type';

import './index.scss';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

const Switcher: PropertyBuilderComponentType<SwitcherType> = (props?) => {
  const { value_path, default_value, title, layout } = props || {};

  const ensuredValuePath = useMemo(() => value_path ?? 'value', [value_path]);

  const value = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    (value: Boolean) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, ensuredValuePath, value);
        },
        { attribute: title ?? '' },
      );
    },
    [updateChosenElementData, ensuredValuePath, title],
  );

  return (
    <div
      className="yaymail-editor-property yaymail-editor-property-switcher"
      data-layout={layout ?? 'inline'}
    >
      <div className="yaymail-title">{__(title ?? 'Text')}</div>
      <Switch checked={value ?? default_value} onChange={handleOnChange} />
    </div>
  );
};

export default Switcher;
