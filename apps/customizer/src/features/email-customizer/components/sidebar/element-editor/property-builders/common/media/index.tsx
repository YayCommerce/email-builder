import { useCallback } from 'react';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../../types';
import MediaBase from '../../base/media-base';
import { ImageType } from './type';

const Media: PropertyBuilderComponentType<ImageType> = (props?) => {
  const {
    value_path,
    media_type,
    title,
    button_title,
    show_preview,
    show_delete_button,
    hide_preview_on_empty_url,
    url_input_placeholder,
  } = props || {};
  const nonNullValuePath = value_path ?? 'src';
  const url = useTemplateContentStore((state) => {
    return getValueByPath(state.chosenElement?.data, nonNullValuePath);
  });
  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const updateImageData = useCallback(
    (src: string) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, nonNullValuePath, src);
        },
        { attribute: props?.title ?? __('Image src', 'yaymail') },
      );
    },
    [updateChosenElementData, nonNullValuePath],
  );

  return (
    <MediaBase
      value={url}
      mediaUrlUpdateCallback={updateImageData}
      mediaType={media_type}
      buttonTitle={button_title}
      showPreview={show_preview}
      title={title}
      showDeleteButton={show_delete_button}
      hidePreviewOnEmptyUrl={hide_preview_on_empty_url}
      urlInputPlaceHolder={url_input_placeholder}
    />
  );
};

export default Media;
