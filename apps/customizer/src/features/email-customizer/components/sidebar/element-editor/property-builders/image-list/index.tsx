// eslint-disable-next-line no-restricted-imports
import { useImageListStore } from '@src/features/email-customizer/components/email-template-container/elements/image-list/store';
import useTemplateContentStore from '@src/stores/templateContent';

import { __ } from '@wordpress/i18n';
import { getValueByPath } from '@yaymail/utilities/src/functions';

import { Align, CopyColumn, Dimension, Media, Spacing, Switcher, TextInput } from '..';

const ImageList = () => {
  const currentColumn = useImageListStore((state) => state.selectedColumn);
  const column1FullWidth = useTemplateContentStore(
    (state) => getValueByPath(state.chosenElement?.data, 'image_list.column_1.full_width.value') === true,
  );
  const column2FullWidth = useTemplateContentStore(
    (state) => getValueByPath(state.chosenElement?.data, 'image_list.column_2.full_width.value') === true,
  );
  const column3FullWidth = useTemplateContentStore(
    (state) => getValueByPath(state.chosenElement?.data, 'image_list.column_3.full_width.value') === true,
  );

  return (
    <>
      <CopyColumn title={__('Copy column', 'yaymail')} store={useImageListStore} />
      <div style={{ display: currentColumn == 1 ? 'block' : 'none' }}>
        <Spacing value_path="image_list.column_1.padding.value" title={__('Padding', 'yaymail')} />
        <Align value_path="image_list.column_1.align.value" />
        <Media value_path="image_list.column_1.image.value" />
        <Switcher value={false} value_path="image_list.column_1.full_width.value" title={__('Full width', 'yaymail')} />
        {!column1FullWidth && (
          <Dimension value_path="image_list.column_1.width.value" min={0} max={140} title={__('Width', 'yaymail')} />
        )}
        <TextInput
          value_path="image_list.column_1.url.value"
          default_value="#"
          title={__('URL', 'yaymail')}
        />
        <TextInput
          value_path="image_list.column_1.alt.value"
          title={__('ALT text', 'yaymail')}
          default_value=""
        />
      </div>
      <div style={{ display: currentColumn == 2 ? 'block' : 'none' }}>
        <Spacing value_path="image_list.column_2.padding.value" title={__('Padding', 'yaymail')} />
        <Align value_path="image_list.column_2.align.value" />
        <Media value_path="image_list.column_2.image.value" />
        <Switcher value={false} value_path="image_list.column_2.full_width.value" title={__('Full width', 'yaymail')} />
        {!column2FullWidth && (
          <Dimension value_path="image_list.column_2.width.value" min={0} max={140} title={__('Width', 'yaymail')} />
        )}
        <TextInput
          value_path="image_list.column_2.url.value"
          default_value="#"
          title={__('URL', 'yaymail')}
        />
        <TextInput
          value_path="image_list.column_2.alt.value"
          title={__('ALT text', 'yaymail')}
          default_value=""
        />
      </div>
      <div style={{ display: currentColumn == 3 ? 'block' : 'none' }}>
        <Spacing value_path="image_list.column_3.padding.value" title={__('Padding', 'yaymail')} />
        <Align value_path="image_list.column_3.align.value" />
        <Media value_path="image_list.column_3.image.value" />
        <Switcher value={false} value_path="image_list.column_3.full_width.value" title={__('Full width', 'yaymail')} />
        {!column3FullWidth && (
          <Dimension value_path="image_list.column_3.width.value" min={0} max={140} title={__('Width', 'yaymail')} />
        )}
        <TextInput
          value_path="image_list.column_3.url.value"
          default_value="#"
          title={__('URL', 'yaymail')}
        />
        <TextInput
          value_path="image_list.column_3.alt.value"
          title={__('ALT text', 'yaymail')}
          default_value=""
        />
      </div>
    </>
  );
};

export default ImageList;
