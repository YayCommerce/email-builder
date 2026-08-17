/* eslint-disable no-restricted-imports */
import { IGeneralSettingData } from '@src/features/email-customizer/components/sidebar/type';

import { ElementType, IElement } from '@src/features/email-customizer';
import { IShortcode } from '@src/features/email-customizer/type';
import { ITemplate } from '@src/features/email-templates';

import { RevisionListType } from '../api/types';

export interface ICustomHookProps {
  template_data: ITemplate | null;
  order_id: string;
  attributes: { [key: string]: string };
}
export type AjaxRequestType = ReturnType<typeof window.jQuery.ajax> | null;
export interface ITemplateOnLoadProps {
  template_name?: string;
  order_id?: string;
}

export interface ITemplateOnLoadData {
  settings_data: IGeneralSettingData;
  templates_data: any;
  selected_template_data: ITemplate | null;
  elements_data: IElement<ElementType>[];
  revisions_data: RevisionListType;
  shortcodes_data: IShortcode[];
}
