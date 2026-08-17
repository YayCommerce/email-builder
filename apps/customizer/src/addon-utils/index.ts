/* eslint-disable no-restricted-imports */

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

import useAddonStore, { IAddonComponent } from '@src/stores/addonStore';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import {
  getDimensionValue,
  replacePlaceholders,
  setValueByPath,
} from '@yaymail/utilities/src/functions';
export function getAddonElementComponent(type: string): IAddonComponent['component'] {
  const addonElements = useAddonStore.getState().addonComponents;

  const foundElement = addonElements.find((element) => element.type === type);
  return foundElement ? foundElement.component : ((() => null) as IAddonComponent['component']);
}

export function initializeAddonWindowVariables() {
  window.yaymailData.shared = {
    ...window.yaymailData.shared,
    util_functions: {
      getDimensionValue,
      setValueByPath,
      replacePlaceholders,
      __,
    },
    stores: {
      useAddonStore,
      useTemplateContentStore,
      useCustomizerSettingsStore,
    },
    core_components: {
      ElementWrapper,
      EditZone,
      TableLabelEditPortals,
      propertyBuilders,
    },
    constants: {
      ORDER_DETAILS_LABEL_ZONES,
    },
    hooks: {
      useShortcode,
    },
    antd: {
      Button,
      Input,
      Menu,
      Modal,
      Tooltip,
      Switch,
      Skeleton,
      message,
      DatePicker,
    },
    antd_icons: {
      DeleteOutlined,
    },
    provider: {
      AntdConfigProvider,
    },
    react_query: {
      useQuery,
      useMutation,
    },
  };
  window.yaymailData.yaymailHooks = (window as any).wp.hooks.createHooks();
}
