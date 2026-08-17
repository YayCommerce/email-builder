import { useState } from 'react';

import { useCustomEventEffect } from '@src/hooks/useCustomEvent';
import useTemplateContentStore from '@src/stores/templateContent';

import { __ } from '@wordpress/i18n';
import { getValueByPath } from '@yaymail/utilities/src/functions';

import { FONT_FAMILY_OPTION_ELEMENTS } from '../../editor-builder/element-property/utils';
import { Align, Dimension, Media, RichTextEditor, Selector, Spacing, Switcher, TextInput } from '..';

const ImageColumnEditors = () => {
  const isFullWidth = useTemplateContentStore(
    (state) => getValueByPath(state.chosenElement?.data, 'image_box.column_1.full_width.value') === true,
  );

  return (
    <>
      <Spacing value_path="image_box.column_1.padding.value" title={__('Padding', 'yaymail')} />
      <Align value_path="image_box.column_1.align.value" />
      <Media value_path="image_box.column_1.image.value" />
      <Switcher value={false} value_path="image_box.column_1.full_width.value" title={__('Full width', 'yaymail')} />
      {!isFullWidth && <Dimension value_path="image_box.column_1.width.value" title={__('Width', 'yaymail')} />}
      <TextInput
        value_path="image_box.column_1.url.value"
        default_value="#"
        title={__('URL', 'yaymail')}
      />
      <TextInput
        value_path="image_box.column_1.alt.value"
        title={__('ALT text', 'yaymail')}
        default_value=""
      />
    </>
  );
};

const TextColumnEditor = () => {
  return (
    <>
      <Spacing value_path="image_box.column_2.padding.value" />
      <Selector
        value_path="image_box.column_2.font_family.value"
        title={__('Font family', 'yaymail')}
      >
        {FONT_FAMILY_OPTION_ELEMENTS}
      </Selector>
      <RichTextEditor
        value_path="image_box.column_2.rich_text.value"
        editor_id="yaymail-image-box-text-editor"
      />
    </>
  );
};

const ImageBox = () => {
  const [activeColumn, setActiveColumn] = useState<'column_1' | 'column_2'>('column_1');

  useCustomEventEffect('onYayMailImageBoxColumnSelected', (e: CustomEvent) => {
    setActiveColumn(e.detail);
  });
  return (
    <>
      {activeColumn === 'column_1' && <ImageColumnEditors />}
      {activeColumn === 'column_2' && <TextColumnEditor />}
    </>
  );
};

export default ImageBox;
