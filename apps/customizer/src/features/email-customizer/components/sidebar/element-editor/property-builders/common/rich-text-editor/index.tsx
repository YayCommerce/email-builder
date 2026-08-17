import { useCallback, useMemo } from 'react';

import BaseRichTextEditor from '@src/components/base-rich-text-editor';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import { RichTextEditorType } from './type';

import './index.scss';
const RichTextEditor: PropertyBuilderComponentType<RichTextEditorType> = (props?) => {
  const chosenElementId = useTemplateContentStore((state) => state.chosenElement?.id);
  const ID = (props?.editor_id === undefined ? chosenElementId : props.editor_id)?.toString();

  const nonNullValuePath = props?.value_path ?? 'rich_text';
  const backgroundColorPath = props?.background_color_path ?? 'background_color';
  const textColorPath = props?.text_color_path ?? 'text_color';
  const richText = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, nonNullValuePath);
  });
  const editorBackgroundColor = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, backgroundColorPath);
  });
  const editorTextColor = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, textColorPath);
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const title = useMemo(() => props?.title ?? __('Content', 'yaymail'), []);

  const handleOnChange = useCallback(
    (content: string) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, nonNullValuePath, content);
        },
        { attribute: props?.title ?? __('Content', 'yaymail') },
      );
    },
    [updateChosenElementData, nonNullValuePath],
  );

  return (
    <BaseRichTextEditor
      id={ID}
      value={richText}
      onChange={handleOnChange}
      title={title}
      editorBackgroundColor={editorBackgroundColor}
      editorTextColor={editorTextColor}
    />
  );
};
export default RichTextEditor;
