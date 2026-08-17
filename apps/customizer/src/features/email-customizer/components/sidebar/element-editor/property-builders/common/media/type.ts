import { MediaBaseType } from '../../base/media-base/type';

export type ImageType = {
  title?: string;
  value_path?: string;
  media_type?: string;
  button_title?: string;
  show_preview?: boolean;
  show_delete_button?: boolean;
  hide_preview_on_empty_url?: boolean;
  url_input_placeholder?: string;
};
