/* eslint-disable no-restricted-imports */
import { useCallback } from 'react';

import { useTextListStore } from '@src/features/email-customizer/components/email-template-container/elements/text-list/store';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import {
  BUTTON_TYPE_OPTIONS,
  FONT_FAMILY_OPTION_ELEMENTS,
  WEIGHT_OPTIONS,
} from '../../editor-builder/element-property/utils';
import { PropertyBuilderPropType } from '../../types';
import {
  Align,
  BorderRadius,
  Color,
  CopyColumn,
  Dimension,
  GridLayout,
  RichTextEditor,
  Selector,
  Spacing,
  TextInput,
} from '..';
import { ColorType } from '../common/color/type';
import { setValueByPath } from '../utils';
import ButtonTogglers from './button-togglers';

const COLUMN_NUMBERS = [1, 2, 3];
const TextList = () => {
  const currentColumn = useTextListStore((state) => state.selectedColumn) ?? 0;

  return (
    <>
      <ButtonTogglers />
      <CopyColumn title={__('Copy column', 'yaymail')} store={useTextListStore} />
      {COLUMN_NUMBERS.includes(currentColumn) && <ColumnSettings columnNumber={currentColumn} />}
    </>
  );
};

function ColumnSettings({ columnNumber }: { columnNumber: number }) {
  const currentElement = useTextListStore((state) => state.selectedElement);

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  // const buttonType = useTemplateContentStore((state) =>
  //   getValueByPath(state.chosenElement?.data, `text_list.column_${index}.button_type`),
  // );
  // const buttonBGColor = useTemplateContentStore((state) =>
  //   getValueByPath(state.chosenElement?.data, `text_list.column_${index}.button_background_color`),
  // );

  const getFullAttributeString = useCallback(
    (subAttribute: string) => `text_list.column_${columnNumber}.${subAttribute}.value`,
    [columnNumber],
  );

  return (
    <>
      <div style={{ display: currentElement == 1 ? 'block' : 'none' }}>
        <Spacing value_path={getFullAttributeString('padding')} title={__('Padding', 'yaymail')} />
        <Selector
          value_path={getFullAttributeString('font_family')}
          title={__('Font family', 'yaymail')}
        >
          {FONT_FAMILY_OPTION_ELEMENTS}
        </Selector>
        <RichTextEditor
          value_path={getFullAttributeString('rich_text')}
          editor_id={`text-list-element-editor-column-${columnNumber}`}
        />
      </div>
      <div style={{ display: currentElement == 2 ? 'block' : 'none' }}>
        <Selector
          value_path={getFullAttributeString('button_type')}
          options={BUTTON_TYPE_OPTIONS}
          defaultValue={BUTTON_TYPE_OPTIONS[0] ?? 'default'}
          title={__('Type', 'yaymail')}
          onChange={(value: string) => {
            const selectedColor = BUTTON_TYPE_OPTIONS.find((t) => t.value === value)?.color ?? '';

            updateChosenElementData(
              (data) => {
                setValueByPath(data, getFullAttributeString('button_type'), value);
              },
              { attribute: __('Button Type', 'yaymail') },
            );
            updateChosenElementData((data) => {
              setValueByPath(
                data,
                getFullAttributeString('button_background_color'),
                selectedColor,
              );
            }, {});
          }}
        />
        <Align value_path={getFullAttributeString('button_align')} />
        <Spacing
          value_path={getFullAttributeString('button_padding')}
          title={__('Padding', 'yaymail')}
        />
        <BorderRadius
          value_path={getFullAttributeString('button_border_radius')}
          title={__('Border radius', 'yaymail')}
        />
        <TextInput
          value_path={getFullAttributeString('button_text')}
          title={__('Button text', 'yaymail')}
          default_value={__('Click me', 'yaymail')}
        />
        <TextInput
          value_path={getFullAttributeString('button_url')}
          title={__('URL', 'yaymail')}
          default_value="#"
        />
        <GridLayout
          itemList={[
            {
              Component: Color,
              props: {
                title: __('Background color', 'yaymail'),
                attribute: getFullAttributeString('button_background_color'),
                value_path: getFullAttributeString('button_background_color'),
              } as PropertyBuilderPropType<ColorType>,
            },
            {
              Component: Color,
              props: {
                title: __('Text color', 'yaymail'),
                attribute: getFullAttributeString('button_text_color'),
                value_path: getFullAttributeString('button_text_color'),
              } as PropertyBuilderPropType<ColorType>,
            },
          ]}
        />

        <Dimension
          value_path={getFullAttributeString('button_font_size')}
          min={10}
          max={40}
          title={__('Font size', 'yaymail')}
        />
        <Dimension
          value_path={getFullAttributeString('button_height')}
          min={0}
          max={100}
          title={__('Height', 'yaymail')}
        />
        <Dimension
          value_path={getFullAttributeString('button_width')}
          min={0}
          max={100}
          unit="%"
          title={__('Width', 'yaymail')}
        />
        <Selector
          value_path={getFullAttributeString('button_weight')}
          options={WEIGHT_OPTIONS}
          defaultValue={WEIGHT_OPTIONS[0] ?? 'normal'}
          title={__('Weight', 'yaymail')}
        />
        <Selector
          value_path={getFullAttributeString('button_font_family')}
          defaultValue={window.yaymailData.builder.font_families[0] ?? ''}
          title={__('Font family', 'yaymail')}
        >
          {FONT_FAMILY_OPTION_ELEMENTS}
        </Selector>
      </div>
    </>
  );
}

export default TextList;
