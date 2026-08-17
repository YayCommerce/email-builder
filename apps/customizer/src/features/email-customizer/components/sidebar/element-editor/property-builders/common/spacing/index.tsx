import { useCallback, useMemo } from 'react';

import { Space } from 'antd';

// eslint-disable-next-line no-restricted-imports
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';
import NumberInputBase from '../../base/number-input-base';
import { SpacingType as PropertyBuilderPropsType } from './type';

import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

const PADDING_SUB_ATTRIBUTES = [
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'left', label: 'Left' },
  { key: 'right', label: 'Right' },
];

const Spacing: PropertyBuilderComponentType<PropertyBuilderPropsType> = (props?) => {
  const { title, value_path, min, max } = props || {};

  const ensuredValuePath = value_path ?? 'padding';

  const spacing = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const displayTitle = useMemo(() => title ?? __('Spacing', 'yaymail'), [title]);

  const handleChange = useCallback(
    (positionKey: string) => (value: number) => {
      const updateData = { ...spacing };
      // updateData.default_value = { ...updateData.default_value };
      updateData[positionKey] = value;
      updateChosenElementData(
        (data) => {
          setValueByPath(data, ensuredValuePath, updateData);
        },
        { attribute: displayTitle },
      );
    },
    [updateChosenElementData, spacing],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-padding">
      <div className="yaymail-title">{__(displayTitle)}</div>
      <Space className="yaymail-controls-container">
        {PADDING_SUB_ATTRIBUTES?.map(({ key, label }) => {
          return (
            <NumberInputBase
              max={max ?? 300}
              min={min ?? 0}
              key={key}
              label={label}
              value={spacing?.[key] || 0}
              onChange={handleChange(key)}
            />
          );
        })}
      </Space>
    </div>
  );
};

export default Spacing;
