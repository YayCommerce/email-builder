import { useCallback, useMemo } from 'react';

import { Checkbox, Col, Row } from 'antd';
import { CheckboxOptionType } from 'antd/es/checkbox/Group';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, isDefined, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import { CheckboxGroupType } from './type';

const CheckboxGroup: PropertyBuilderComponentType<CheckboxGroupType> = (props?) => {
  const { value_path, options, defaultValue, number_of_columns } = props || {};
  const ensuredValuePath = useMemo(() => value_path ?? 'showing_items', [value_path]);

  const checkbox = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, ensuredValuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  if (!isDefined(checkbox)) return null;

  const onChange = (checkedValues: any[]) => {
    const newValue = checkedValues.map((value) =>
      typeof value === 'string' ? value : value.toString(),
    );
    updateChosenElementData(
      (data) => {
        setValueByPath(data, ensuredValuePath, newValue);
      },
      { attribute: props?.title ?? __('Items', 'yaymail') },
    );
  };

  const { title } = props || {};

  const columnSpan = useMemo(() => Math.floor(24 / (number_of_columns || 1)), [number_of_columns]);

  const getOptionAttribute = useCallback(
    (option: CheckboxOptionType | string | number, attribute: 'value' | 'label') => {
      return typeof option === 'string' || typeof option === 'number' ? option : option[attribute];
    },
    [],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-checkbox-group">
      <div className="yaymail-title">{__(title ?? 'Items')}</div>
      <div className="yaymail-controls-container">
        <Checkbox.Group
          defaultValue={defaultValue}
          onChange={props?.onChange ?? onChange}
          value={checkbox}
        >
          <Row>
            {options?.map((option, index) => (
              <Col span={columnSpan} key={index}>
                <Checkbox
                  value={getOptionAttribute(option, 'value')}
                  style={{ color: YAYMAIL_TOKENS.color.white }}
                >
                  {getOptionAttribute(option, 'label')}
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </div>
    </div>
  );
};

export default CheckboxGroup;
