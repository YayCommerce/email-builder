export type MediaBaseType = {
  className?: string;
  title?: string;
  value: any;
  // eslint-disable-next-line no-unused-vars
  mediaUrlUpdateCallback: (mediaUrl: string, uploadedMedia?: any) => void;
  mediaType?: string;
  buttonTitle?: string;
  showPreview?: boolean;
  showDeleteButton?: boolean;
  hidePreviewOnEmptyUrl?: boolean;
  urlInputPlaceHolder?: string;
};
