import { ReactElement, ReactNode } from 'react';

import { ElementType, IElement } from '@src/features/email-customizer';
import jQuery from '@types/jquery';

type YayMailDataType = import('@src/common/types/localize/yaymailData.type').YayMailDataType;

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    jQuery: typeof jQuery;
    yaymailData: YayMailDataType;
    wp: { editor: any; media: any };
    tinymce: any;
    yaymailAllElements: IElement<ElementType>[];
    accounting: any;
  }
}

export type ComponentChildren = ReactElement | ReactNode | boolean | string;
