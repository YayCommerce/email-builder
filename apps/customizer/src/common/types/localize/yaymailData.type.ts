import { useMutation, useQuery } from 'react-query';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, DatePicker, Input, Menu, message, Modal, Skeleton, Switch, Tooltip } from 'antd';

import AntdConfigProvider from '@src/components/antd-config-provider';
import EditZone from '@src/components/edit-zone';
import TableLabelEditPortals, {
  ORDER_DETAILS_LABEL_ZONES,
} from '@src/components/edit-zone/TableLabelEditPortals';
import ElementWrapper from '@src/features/email-customizer/components/element-wrapper';
import * as propertyBuilders from '@src/features/email-customizer/components/sidebar/element-editor/property-builders';

import useShortcode from '@src/hooks/useShortcode';

import { IElement } from '@src/features/email-customizer';
import { PatternType } from '@src/features/email-customizer/type';
import useAddonStore from '@src/stores/addonStore';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import {
  getDimensionValue,
  getValueByPath,
  replacePlaceholders,
  setValueByPath,
} from '@yaymail/utilities/src/functions';

type OrderType = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  order_number: string;
  title: string;
};

export type YayMailDataType = {
  urls: {
    asset_url: string;
    vite_dynamic_base: string;
    home_url: string;
    [key: string]: string;
  };
  is_rtl: boolean;
  admin_ajax: {
    nonce: string;
    url: string;
  };
  rest_path: {
    root: string;
    base: string;
    nonce: string;
  };
  list_orders: OrderType[];
  i18n: {
    locale_data: {
      messages: {
        [key: string]: string;
      };
    };
  };
  colors: {
    default_text_link_color: string;
    default_background_color: string;
    default_content_background_color: string;
    default_content_text_color: string;
    default_title_color: string;
  };
  builder: {
    font_families: string[];
    social_icons: {
      themes: string[] | null;
      images: Array<{
        name: string;
        data: Array<{
          theme: string;
          src: string;
        }>;
      }> | null;
      icons: string[];
    };
    revision_limit: number;
    global_headers_footers: {
      global_header_elements: IElement[];
      global_footer_elements: IElement[];
    };
    section_templates: Array<
      IElement & {
        patterns: Array<PatternType>;
      }
    >;
    patterns: PatternType[];
  };
  smtp: {
    link_detail: string;
    setting: string;
    is_active: boolean;
  };
  reviewed: boolean;
  viewed_new_elements?: string[];
  /** Which YayMail products are active; drives Addons page platform copy (Woo vs WP vs both). */
  platform?: 'yaymail' | 'email-builder';
  test_email_address: string;
  site_title: string;
  is_critical_migration_required: boolean;
  ghf_disallowed_element_types: string[];
  shared: {
    util_functions: {
      getDimensionValue: typeof getDimensionValue;
      __: typeof __;
      setValueByPath: typeof setValueByPath;
      replacePlaceholders: typeof replacePlaceholders;
    };
    stores: {
      useAddonStore: typeof useAddonStore;
      useTemplateContentStore: typeof useTemplateContentStore;
      useCustomizerSettingsStore: typeof useCustomizerSettingsStore;
    };
    core_components: {
      ElementWrapper: typeof ElementWrapper;
      EditZone: typeof EditZone;
      TableLabelEditPortals: typeof TableLabelEditPortals;
      propertyBuilders: typeof propertyBuilders;
    };
    constants: {
      ORDER_DETAILS_LABEL_ZONES: typeof ORDER_DETAILS_LABEL_ZONES;
    };
    hooks: {
      useShortcode: typeof useShortcode;
    };
    activated_addons: string[];
    antd: {
      Input: typeof Input;
      Button: typeof Button;
      Menu: typeof Menu;
      Modal: typeof Modal;
      Tooltip: typeof Tooltip;
      Skeleton: typeof Skeleton;
      Switch: typeof Switch;
      message: typeof message;
      DatePicker: typeof DatePicker;
    };
    antd_icons: {
      DeleteOutlined: typeof DeleteOutlined;
    };
    provider: {
      AntdConfigProvider: typeof AntdConfigProvider;
    };
    react_query: {
      useQuery: typeof useQuery;
      useMutation: typeof useMutation;
    };
  };
  yaymailHooks: any;
  [key: string]: unknown;
};
