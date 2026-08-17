import { useCallback, useMemo } from 'react';

import { InputNumber, Space } from 'antd';

import { ReactComponent as BottomLeftRadiusIcon } from '@src/assets/svgs/bottom-left-radius.svg';
import { ReactComponent as BottomRightRadiusIcon } from '@src/assets/svgs/bottom-right-radius.svg';
import { ReactComponent as TopLeftRadiusIcon } from '@src/assets/svgs/top-left-radius.svg';
import { ReactComponent as TopRightRadiusIcon } from '@src/assets/svgs/top-right-radius.svg';
// eslint-disable-next-line no-restricted-imports
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import { BorderRadiusType as PropertyBuilderPropsType } from './type';

import './index.scss';

const BORDER_RADIUS_SUB_ATTRIBUTES = [
  { key: 'top_left', label: 'Top Left', icon: <TopLeftRadiusIcon /> },
  { key: 'top_right', label: 'Top Right', icon: <TopRightRadiusIcon /> },
  { key: 'bottom_left', label: 'Bottom left', icon: <BottomLeftRadiusIcon /> },
  { key: 'bottom_right', label: 'Bottom right', icon: <BottomRightRadiusIcon /> },
];

const BorderRadius: PropertyBuilderComponentType<PropertyBuilderPropsType> = (props?) => {
  const { title, value_path, min, max } = props || {};

  const ensuredValuePath = value_path ?? 'border_radius';

  const dataValue = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const displayTitle = useMemo(() => title ?? __('Border radius', 'yaymail'), [title]);

  const handleChange = useCallback(
    (positionKey: string) => (value: number) => {
      const updateData = { ...dataValue };
      updateData[positionKey] = value;
      updateChosenElementData(
        (data) => {
          setValueByPath(data, ensuredValuePath, updateData);
        },
        { attribute: displayTitle },
      );
    },
    [updateChosenElementData, dataValue],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-border-radius">
      <div className="yaymail-title">{__(displayTitle)}</div>
      <Space className="yaymail-controls-container">
        {BORDER_RADIUS_SUB_ATTRIBUTES?.map(({ key, icon }) => {
          return (
            <InputNumber
              key={key}
              value={dataValue?.[key] || 0}
              min={min ?? 0}
              max={max ?? 300}
              onChange={(value) => handleChange(key)(value as number)}
              addonBefore={icon}
            />
          );
        })}
      </Space>
    </div>
  );
};

export default BorderRadius;
