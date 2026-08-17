import { useCallback } from 'react';

import { DatePicker as AntdDatePicker } from 'antd';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import dayjs from 'dayjs';

import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';
import { PropertyBuilderComponentType } from '../../../types';
import { DatePickerType } from './type';

const { RangePicker } = AntdDatePicker;

const DatePicker: PropertyBuilderComponentType<DatePickerType> = (props?) => {
  const { value_path, title, onChange, style, calendar_type } = props ?? {};

  if (!value_path) return null;

  const dateValue = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, value_path);
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    (value: any) => {
      updateChosenElementData(
        (data) => {
          let changedValue = value;

          if (calendar_type === 'range' && changedValue != null && changedValue.length > 1) {
            changedValue = [
              dayjs(value[0]).format('YYYY-MM-DD'),
              dayjs(value[1]).format('YYYY-MM-DD'),
            ];
          }

          setValueByPath(data, value_path, changedValue);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, title, calendar_type],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-number-input">
      <div className="yaymail-title">{title ?? __('Choose date', 'yaymail')}</div>
      <div className="yaymail-controls-container">
        {calendar_type === 'range' ? (
          <RangePicker
            format="YYYY-MM-DD"
            style={style ?? { width: '100%' }}
            defaultValue={
              dateValue
                ? [dayjs(dateValue[0], 'YYYY-MM-DD'), dayjs(dateValue[1], 'YYYY-MM-DD')]
                : undefined
            }
            onChange={handleOnChange ?? onChange}
          />
        ) : (
          <AntdDatePicker
            format="YYYY-MM-DD"
            style={style ?? { width: '100%' }}
            defaultValue={dateValue ? dayjs(dateValue, 'YYYY-MM-DD') : undefined}
            onChange={handleOnChange ?? onChange}
          />
        )}
      </div>
    </div>
  );
};

export default DatePicker;
