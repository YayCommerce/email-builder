import { CSSProperties, ReactNode } from 'react';

import { ColorPickerProps } from 'antd';
import { CollapseProps } from 'antd';
export interface ICustomColorPickerProps extends ColorPickerProps {
  title?: ReactNode;
  buttonLabel?: string;
  showPresets?: boolean;
  readOnly?: boolean;
}

export interface ICustomCollapseProps extends CollapseProps {
  panelStyle?: CSSProperties;
}

export interface IGeneralSettingData {
  direction: 'ltr' | 'rtl';
  container_width: number;
  payment_display_mode: 'yes' | 'no' | 'customer';
  show_product_image: boolean;
  product_image_position: 'top' | 'left' | 'bottom';
  product_image_height: number;
  product_image_width: number;
  show_product_sku: boolean;
  show_product_description: boolean;
  show_product_hyper_links: boolean;
  show_product_regular_price: boolean;
  show_product_item_cost: boolean;
  enable_custom_css: boolean;
  custom_css: string;
  global_header_footer_enabled: boolean;
  wp_global_header_footer_enabled: boolean;
}

export interface IEmailSettingsData {
  backgroundColor: string;
  emailContentBackgroundColor: string;
  textLinkColor: string;
}
