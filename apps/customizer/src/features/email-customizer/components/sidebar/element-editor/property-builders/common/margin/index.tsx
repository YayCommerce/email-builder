import { useCallback, useMemo } from 'react';

import { Space } from 'antd';

// eslint-disable-next-line no-restricted-imports
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import NumberInputBase from '../../base/number-input-base';
import { MarginType as PropertyBuilderPropsType } from './type';

const MARGIN_SUB_ATTRIBUTES = [
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Bottom' },
  { key: 'left', label: 'Left' },
  { key: 'right', label: 'Right' },
];

const Margin: PropertyBuilderComponentType<PropertyBuilderPropsType> = (props?) => {
  const { title, description, value_path, min, max } = props || {};

  const ensuredValuePath = value_path ?? 'margin';

  const margin = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const displayTitle = useMemo(() => title ?? __('Margin', 'yaymail'), [title]);

  const handleChange = useCallback(
    (positionKey: string) => (value: number) => {
      const updateData = { ...margin };
      updateData[positionKey] = value;
      updateChosenElementData(
        (data) => {
          setValueByPath(data, ensuredValuePath, updateData);
        },
        { attribute: displayTitle },
      );
    },
    [updateChosenElementData, margin, ensuredValuePath, displayTitle],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-margin">
      <div className="yaymail-title">{__(displayTitle)}</div>
      <Space className="yaymail-controls-container">
        {MARGIN_SUB_ATTRIBUTES?.map(({ key, label }) => {
          return (
            <NumberInputBase
              max={max ?? 300}
              min={min ?? -300}
              key={key}
              label={label}
              value={margin?.[key] ?? 0}
              onChange={handleChange(key)}
            />
          );
        })}
      </Space>
      {description && (
        <div
          className="yaymail-editor-property-description"
          style={{ marginTop: '8px' }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};

export default Margin;
