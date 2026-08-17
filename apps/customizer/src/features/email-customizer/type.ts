/* eslint-disable no-restricted-imports */
import { CSSProperties } from 'react';
import { ItemInterface } from 'react-sortablejs';

import { SocialIconThemeType } from '@src/features/email-customizer/components/email-template-container/elements/social/type';

export interface IElementListProps {
  isDragdropEnabled?: boolean;
  elements: Array<
    IElement & {
      onClick?: () => void;
    }
  >;
  itemClass?: string;
  className?: string;
}

/** Note: When adding a new type, make sure to add a corresponding data type to ElementDataTypeMap as well */
export type ElementType =
  /** Basics */
  | 'logo'
  | 'heading'
  | 'image'
  | 'button'
  | 'text'
  | 'title'
  | 'social_icon'
  | 'video'
  | 'image_list'
  | 'image_box'
  | 'text_list'
  | 'html'
  | 'footer'
  | 'rating_stars'
  | 'countdown'
  | 'order_progress'

  /** Generals */
  | 'space'
  | 'divider'
  | 'column_layout'
  | 'container'

  /** WooCommerces */
  | 'shipping_address'
  | 'billing_address'
  | 'billing_shipping_address'
  | 'order_details'
  | 'hook'
  | 'order_details_download'
  | 'shipping_tax_shipment_tracking'

  /** Not displayed */
  | 'column'
  | 'skeleton_divider';

export type BorderType = {
  side: 'none' | 'top' | 'right' | 'bottom' | 'left' | 'custom';
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';
  color: string;
  custom: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export type ElementDataTypeMap = {
  /** Basics */
  logo: {
    align: AlignType;
    padding: SpacingType;
    src: string;
    width: number;
    background_color: string;
    url: string;
    alt: string;
  };
  heading: {
    align: AlignType;
    padding: SpacingType;
    background_color: string;
    border: BorderType;
    text_color: string;
    font_family: string;
    rich_text: string;
  };
  image: {
    align: AlignType;
    padding: SpacingType;
    src: string;
    width: number;
    full_width?: boolean;
    background_color: string;
    url: string;
    alt: string;
  };
  button: {
    button_type: string;
    align: AlignType;
    padding: SpacingType;
    button_padding: SpacingType;
    border_radius: SpacingType;
    border: BorderType;
    text_align: string;
    url: string;
    background_color: string;
    button_background_color: string;
    text_color: string;
    font_size: number;
    height: number;
    width: number;
    weight: string;
    font_family: string;
    text: string;
  };
  text: {
    padding: SpacingType;
    background_color: string;
    text_color: string;
    font_family: string;
    rich_text: string;
    border: BorderType;
  };
  title: {
    align: AlignType;
    padding: SpacingType;
    background_color: string;
    text_color: string;
    font_family: string;
    title: string;
    title_size: string;
    subtitle: string;
    subtitle_size: string;
  };
  social_icon: {
    align: AlignType;
    padding: SpacingType;
    background_color: string;
    width_icon: number;
    spacing: number;
    theme: SocialIconThemeType;
    icon_list: Array<{
      icon: string;
      url: string;
    }>;
    url: string;
    icon: string;
    icon_size: number;
    icon_color: string;
  };
  video: {
    padding: SpacingType;
    background_color: string;
    src: string;
    width: number;
    height: number;
    url: string;
  };
  image_list: {
    background_color: string;
    number_column: number | string;
    image_list: {
      column_1: {
        align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        image: {
          value: string;
          type: 'style' | 'content';
        };
        full_width: {
          value: boolean;
          type: 'style' | 'content';
        };
        width: {
          value: number;
          type: 'style' | 'content';
        };
        background_color: {
          value: string;
          type: 'style' | 'content';
        };
        url: {
          value: string;
          type: 'style' | 'content';
        };
        alt: {
          value: string;
          type: 'style' | 'content';
        };
      };
      column_2: {
        align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        image: {
          value: string;
          type: 'style' | 'content';
        };
        full_width: {
          value: boolean;
          type: 'style' | 'content';
        };
        width: {
          value: number;
          type: 'style' | 'content';
        };
        background_color: {
          value: string;
          type: 'style' | 'content';
        };
        url: {
          value: string;
          type: 'style' | 'content';
        };
        alt: {
          value: string;
          type: 'style' | 'content';
        };
      };
      column_3: {
        align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        image: {
          value: string;
          type: 'style' | 'content';
        };
        full_width: {
          value: boolean;
          type: 'style' | 'content';
        };
        width: {
          value: number;
          type: 'style' | 'content';
        };
        background_color: {
          value: string;
          type: 'style' | 'content';
        };
        url: {
          value: string;
          type: 'style' | 'content';
        };
        alt: {
          value: string;
          type: 'style' | 'content';
        };
      };
    };
  };
  image_box: {
    background_color: string;
    text_color: string;
    image_box: {
      column_1: {
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        image: {
          value: string;
          type: 'style' | 'content';
        };
        full_width: {
          value: boolean;
          type: 'style' | 'content';
        };
        width: {
          value: number;
          type: 'style' | 'content';
        };
        url: {
          value: string;
          type: 'style' | 'content';
        };
        alt: {
          value: string;
          type: 'style' | 'content';
        };
      };
      column_2: {
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        font_family: {
          value: string;
          type: 'style' | 'content';
        };
        rich_text: {
          value: string;
          type: 'style' | 'content';
        };
      };
    };
  };
  text_list: {
    background_color: string;
    text_color: string;
    number_column: number | string;
    text_list: {
      column_1: {
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        font_family: {
          value: string;
          type: 'style' | 'content';
        };
        rich_text: {
          value: string;
          type: 'style' | 'content';
        };
        show_button: {
          value: boolean;
          type: 'style' | 'content';
        };
        button_type: {
          value: string;
          type: 'style' | 'content';
        };
        button_align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        button_padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        button_border_radius: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        button_text: {
          value: string;
          type: 'style' | 'content';
        };
        button_url: {
          value: string;
          type: 'style' | 'content';
        };
        button_background_color: {
          value: string;
          type: 'style' | 'content';
        };
        button_text_color: {
          value: string;
          type: 'style' | 'content';
        };
        button_font_size: {
          value: number;
          type: 'style' | 'content';
        };
        button_height: {
          value: number;
          type: 'style' | 'content';
        };
        button_width: {
          value: number;
          type: 'style' | 'content';
        };
        button_weight: {
          value: string;
          type: 'style' | 'content';
        };
        button_font_family: {
          value: string;
          type: 'style' | 'content';
        };
      };
      column_2: {
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        font_family: {
          value: string;
          type: 'style' | 'content';
        };
        rich_text: {
          value: string;
          type: 'style' | 'content';
        };
        show_button: {
          value: boolean;
          type: 'style' | 'content';
        };
        button_type: {
          value: string;
          type: 'style' | 'content';
        };
        button_align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        button_padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        button_border_radius: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        button_text: {
          value: string;
          type: 'style' | 'content';
        };
        button_url: {
          value: string;
          type: 'style' | 'content';
        };
        button_background_color: {
          value: string;
          type: 'style' | 'content';
        };
        button_text_color: {
          value: string;
          type: 'style' | 'content';
        };
        button_font_size: {
          value: number;
          type: 'style' | 'content';
        };
        button_height: {
          value: number;
          type: 'style' | 'content';
        };
        button_width: {
          value: number;
          type: 'style' | 'content';
        };
        button_weight: {
          value: string;
          type: 'style' | 'content';
        };
        button_font_family: {
          value: string;
          type: 'style' | 'content';
        };
      };
      column_3: {
        padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        font_family: {
          value: string;
          type: 'style' | 'content';
        };
        rich_text: {
          value: string;
          type: 'style' | 'content';
        };
        show_button: {
          value: boolean;
          type: 'style' | 'content';
        };
        button_type: {
          value: string;
          type: 'style' | 'content';
        };
        button_align: {
          value: AlignType;
          type: 'style' | 'content';
        };
        button_padding: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        button_border_radius: {
          value: SpacingType;
          type: 'style' | 'content';
        };
        button_text: {
          value: string;
          type: 'style' | 'content';
        };
        button_url: {
          value: string;
          type: 'style' | 'content';
        };
        button_background_color: {
          value: string;
          type: 'style' | 'content';
        };
        button_text_color: {
          value: string;
          type: 'style' | 'content';
        };
        button_font_size: {
          value: number;
          type: 'style' | 'content';
        };
        button_height: {
          value: number;
          type: 'style' | 'content';
        };
        button_width: {
          value: number;
          type: 'style' | 'content';
        };
        button_weight: {
          value: string;
          type: 'style' | 'content';
        };
        button_font_family: {
          value: string;
          type: 'style' | 'content';
        };
      };
    };
  };
  html: {
    rich_text: string;
  };
  footer: {
    padding: SpacingType;
    background_color: string;
    text_color: string;
    font_family: string;
    rich_text: string;
  };

  /** Generals */
  space: {
    background_color: string;
    height: number;
  };
  divider: {
    align: AlignType;
    padding: SpacingType;
    width: number;
    height: number;
    background_color: string;
    divider_color: string;
    divider_type: string;
  };
  container: {
    padding: SpacingType;
    background_color: string;
    direction: 'horizontal' | 'vertical';
    background_image?: BackgroundImageType;
  };

  column_layout: {
    amount_of_columns: number;
    column_width: number;
    padding: SpacingType;
    border_radius: SpacingType;
    border?: BorderType;
    background_color: string;
    background_image?: BackgroundImageType;
    inner_border_radius: SpacingType;
    inner_background_color: string;
    /** @since 4.1.0 */
    column_spacing: number;
    vertical_align: 'top' | 'middle' | 'bottom';
  };
  column: {
    width: number;
    border?: BorderType;
  };

  /** WooCommerces */
  shipping_address: {
    padding: SpacingType;
    background_color: string;
    title_color: string;
    text_color: string;
    border_color: string;
    font_family: string;
    title: string;
    rich_text: string;
    layout_type: 'legacy' | 'modern';
    shipping_content_font_size: number | string;
    shipping_content_alignment: AlignType;
    shipping_content_text_format: TextFormatTogglesType;
  };
  billing_address: {
    padding: SpacingType;
    background_color: string;
    title_color: string;
    text_color: string;
    border_color: string;
    font_family: string;
    title: string;
    rich_text: string;
    layout_type: 'legacy' | 'modern';
    billing_content_font_size: number | string;
    billing_content_alignment: AlignType;
    billing_content_text_format: TextFormatTogglesType;
  };
  billing_shipping_address: {
    padding: SpacingType;
    background_color: string;
    title_color: string;
    text_color: string;
    border_color: string;
    font_family: string;
    billing_title: string;
    shipping_title: string;
    billing_address_content: string;
    shipping_address_content: string;
    layout_type: 'legacy' | 'modern';
    responsive_on_mobile: boolean;
    billing_content_font_size: number | string;
    shipping_content_font_size: number | string;
    billing_content_alignment: AlignType;
    shipping_content_alignment: AlignType;
    billing_content_text_format: TextFormatTogglesType;
    shipping_content_text_format: TextFormatTogglesType;
  };
  hook: {
    padding: SpacingType;
    background_color: string;
    text_color: string;
    hook_shortcode: string;
    font_family: string;
  };
  order_details: {
    padding: SpacingType;
    background_color: string;
    title_color: string;
    text_color: string;
    border_color: string;
    font_family: string;
    rich_text: string;
    payment_instructions: string;
    table_content_font_size: number;
    table_heading_font_size: number;
    title: string;
    product_title: string;
    cost_title: string;
    quantity_title: string;
    price_title: string;
    cart_subtotal_title: string;
    payment_method_title: string;
    order_total_title: string;
    order_note_title: string;
    shipping_title: string;
    discount_title: string;
    custom_footer_rows?: Array<{
      id: string;
      label: string;
      value: string;
      zone: 'before_all' | 'after_subtotal' | 'before_total' | 'after_total';
      order: number;
      enabled: boolean;
    }>;
    layout_type: 'legacy' | 'modern';
    show_table_header: boolean;
    border: BorderType;
  };
  order_details_download: {
    padding: SpacingType;
    background_color: string;
    title_color: string;
    text_color: string;
    border_color: string;
    font_family: string;
    rich_text: string;
    title: string;
    product_title: string;
    expires_title: string;
    download_title: string;
    layout_type: 'legacy' | 'modern';
    table_content_font_size: number;
    table_heading_font_size: number;
    border: BorderType;
  };
  // shipping_tax_shipment_tracking: {};
  rating_stars: {
    total_stars: number;
    active_stars: number;
    align: AlignType;
    padding: SpacingType;
    background_color: string;
    size: number;
    spacing: number;
    active_stars_color: string;
    inactive_stars_color: string;
  };
  order_progress: {
    display_style?: 'step_marker' | 'filled_bar';
    padding: SpacingType;
    background_color: string;
    current_step_index: number;
    connector_height: number;
    connector_active_color: string;
    connector_inactive_color: string;
    label_active_color: string;
    label_inactive_color: string;
    icon_size: number;
    /** Filled-bar only: icon wrapper border radius (global). */
    filled_bar_icon_border_radius?: number | string;
    label_font_size: number;
    /** Step label font stack (matches PHP `YAYMAIL_DEFAULT_FAMILY` when unset). */
    font_family?: string;
    steps: Array<{
      title: string;
      image_url?: string;
      /** @deprecated Use element-level label_active_color / label_inactive_color */
      label_color?: string;
      image_bg_color?: string;
      icon_border_color?: string;
      icon_border_style?: 'solid' | 'dashed' | 'dotted';
      icon_border_width?: number | string;
      /** @deprecated Legacy — read via order-progress-step-fields fallbacks */
      label_active_color?: string;
      /** @deprecated Legacy */
      label_inactive_color?: string;
      /** @deprecated Legacy */
      image_active_url?: string;
      /** @deprecated Legacy */
      image_inactive_url?: string;
      /** @deprecated Legacy filled-bar */
      filled_bar_icon_border_color_active?: string;
      /** @deprecated Legacy filled-bar */
      filled_bar_icon_border_color_inactive?: string;
    }>;
  };
};

export type ElementDataCommonType = {
  margin?: SpacingType;
  custom_css_classes?: string;
};

export type AlignType = 'left' | 'center' | 'right';
export type SpacingType = {
  [key: string]: number;
};
export type TextFormatTogglesType = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

export type DimensionType = number | string;

export type BackgroundImageType = {
  url: string;
  position:
    | 'default'
    | 'center_center'
    | 'center_left'
    | 'center_right'
    | 'top_center'
    | 'top_left'
    | 'top_right'
    | 'bottom_center'
    | 'bottom_left'
    | 'bottom_right'
    | 'custom';
  x_position: number;
  y_position: number;
  repeat: 'default' | 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  size: 'default' | 'auto' | 'cover' | 'contain' | 'custom';
  custom_size: number;
};

export interface IElement<T extends ElementType = ElementType> extends ItemInterface {
  type: T;
  children?: IElement[];
  position?: number;
  data: T extends keyof ElementDataTypeMap ? ElementDataTypeMap[T] & ElementDataCommonType : never;
  name?: string;
  parentId?: IElement['id'];
  style?: CSSProperties;
  group: string;
  icon: string;
  available: boolean;
  disabled_reason?: {
    text?: string;
    html?: string;
  };
  tags?: Array<string>;
  status_info?: {
    text: string;
    color: string;
  };
}

export interface ITemplateProps<T extends ElementType = ElementType> {
  element: IElement<T>;
  // TODO This typing does not work
  style?: CSSProperties;
}

export interface IShortcode {
  name: string;
  description: string;
  group: string;
  callback: Array<any>;
  content: string;
  attributes: { [key: string]: string };
}

interface IShortcodeGroup {
  groupLabel: string;
  shortcodes: Array<{
    name: string;
    description: string;
    attributes: { [key: string]: string };
  }>;
}

export interface IShortcodeGroups {
  [key: string]: IShortcodeGroup;
}

export type ArrayElementType<T> = T extends (infer U)[] ? U : never;

export type PatternType = {
  id: string;
  type: string;
  name?: string;
  section: string;
  position: number;
  elements: IElement[];
};
