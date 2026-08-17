/** Reference: https://codex.wordpress.org/Javascript_Reference/wp.media */

import { useEffect, useState } from 'react';

import { ImageType } from '@src/features/email-customizer';
import { isDefined } from '@src/utils';
import { __ } from '@wordpress/i18n';

export function useWordpressMediaSelector(
  id: string,
  // eslint-disable-next-line no-unused-vars
  selectionCallback: (mediaUrl: string, uploadedMedia?: any) => void,
  isMultiple?: boolean,
  mediaType?: ImageType['media_type'],
) {
  const [mediaUploader, setMediaUploader] = useState<{ open: () => void } | null>(null);
  useEffect(() => {
    const newMediaUploader = window.wp.media({
      id,
      title: __('Select a media', 'yaymail'),
      library: {
        type: mediaType ?? 'image',
      },
      button: {
        text: __('Use this image', 'yaymail'),
      },
      multiple: isDefined(isMultiple) ? isMultiple : false, // multiple selections
    });

    newMediaUploader.on('select', () => {
      const uploadedMedia = newMediaUploader.state().get('selection').first();

      const mediaUrl = uploadedMedia.toJSON().url;

      selectionCallback(mediaUrl, uploadedMedia);
    });
    setMediaUploader(newMediaUploader);
  }, [isMultiple, selectionCallback, id]);

  useEffect(() => {
    return () => {
      window.jQuery(`#${id}`).closest('[id^="__wp-uploader-id"]').remove();
      window.jQuery('button[type="button"].browser').remove();
    };
  }, []);

  return { mediaUploader };
}
