import { useCallback } from 'react';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';
import { getValueByPath, setValueByPath } from '../../utils';

import './index.scss';

type ColumnNumber = 1 | 2 | 3;
const COLUMN_NUMBERS: ColumnNumber[] = [1, 2, 3];

const ButtonTogglers: PropertyBuilderComponentType<any> = () => {
  const amountOfColumns = Number(
    useTemplateContentStore((state) =>
      getValueByPath<number | string>(state.chosenElement?.data, 'number_column'),
    ),
  );

  const getAttributeString = useCallback((columnNumber: ColumnNumber) => {
    return `text_list.column_${columnNumber}.show_button`;
  }, []);

  const showButton1 = useTemplateContentStore((state) =>
    getValueByPath<boolean>(state.chosenElement?.data, getAttributeString(1)),
  );

  const showButton2 = useTemplateContentStore((state) =>
    getValueByPath<boolean>(state.chosenElement?.data, getAttributeString(2)),
  );

  const showButton3 = useTemplateContentStore((state) =>
    getValueByPath<boolean>(state.chosenElement?.data, getAttributeString(3)),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const handleOnChange = useCallback(
    (columnNumber: ColumnNumber) => {
      const attribute = getAttributeString(columnNumber);

      updateChosenElementData(
        (data) => {
          const oldValue = getValueByPath<boolean>(data, attribute);
          setValueByPath(data, attribute, !oldValue);
        },

        { attribute: __('Show/Hide button', 'yaymail') },
      );
    },
    [updateChosenElementData],
  );

  const checkIfButtonIsActive = useCallback(
    (columnNumber: ColumnNumber) => {
      const showButtons: Record<ColumnNumber, boolean> = {
        1: Boolean(showButton1),
        2: Boolean(showButton2),
        3: Boolean(showButton3),
      };

      return showButtons[columnNumber];
    },
    [showButton1, showButton2, showButton3],
  );
  const getButtonClassNames = useCallback(
    (currentColumnNumber: ColumnNumber) => {
      let classes = ['yaymail-select-button-option'];
      if ((amountOfColumns ?? 1) >= currentColumnNumber) {
        classes.push('yaymail-select-button-option-show');
      }
      if (checkIfButtonIsActive(currentColumnNumber)) {
        classes.push('yaymail-select-button-option-active');
      }
      return classes.join(' ');
    },
    [amountOfColumns, checkIfButtonIsActive],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-select-button">
      <div className="yaymail-title">{__('Show button in column:', 'yaymail')}</div>
      <div className="yaymail-controls-container">
        <div className="yaymail-select-button-wrapper">
          {COLUMN_NUMBERS.map((columnNumber) => (
            <div
              key={columnNumber}
              className={getButtonClassNames(columnNumber)}
              onClick={() => handleOnChange(columnNumber)}
            >
              <span>{columnNumber}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ButtonTogglers;
