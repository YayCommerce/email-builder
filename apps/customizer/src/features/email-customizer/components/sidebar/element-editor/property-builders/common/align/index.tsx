import { useCallback } from 'react';

import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from '@ant-design/icons';
import { Radio, RadioChangeEvent } from 'antd';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, isDefined, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';

import './index.scss';

const Align: PropertyBuilderComponentType<any> = (props?) => {
  const value_path = props.value_path || 'align';
  const align = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, value_path) ?? 'left',
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  if (!isDefined(align)) return null;

  const handleOnChange = useCallback(
    (e: RadioChangeEvent) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, value_path, e.target.value);
        },
        { attribute: props?.title ?? 'Align' },
      );
    },
    [updateChosenElementData, align, value_path],
  );

  const { title } = props || {};

  return (
    <div className="yaymail-editor-property yaymail-editor-property-align">
      <div className="yaymail-title">{__(title ?? 'Align')}</div>
      <div className="yaymail-controls-container">
        <Radio.Group
          defaultValue="left"
          size="large"
          className="yaymail-align-radio-group"
          value={align}
          onChange={handleOnChange}
        >
          <Radio.Button value="left" className="yaymail-align-radio-group-option">
            <AlignLeftOutlined />
          </Radio.Button>
          <Radio.Button value="center" className="yaymail-align-radio-group-option">
            <AlignCenterOutlined />
          </Radio.Button>
          <Radio.Button value="right" className="yaymail-align-radio-group-option">
            <AlignRightOutlined />
          </Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
};

export default Align;
