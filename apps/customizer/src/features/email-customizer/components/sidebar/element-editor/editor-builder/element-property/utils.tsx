import { Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

import { pascalCaseToCapitalizedWords } from '@src/utils';
import { __ } from '@wordpress/i18n';

const { Option } = Select;
export const FONT_FAMILY_OPTION_ELEMENTS = (
  <>
    {window.yaymailData.builder.font_families.map((option) => (
      <Option value={option} label={option} key={option}>
        <span style={{ fontFamily: option, fontWeight: 400 }}>{option}</span>
      </Option>
    ))}
  </>
);

export const BUTTON_TYPE_OPTIONS = [
  { label: __('Default', 'yaymail'), value: 'default', color: '#3498db' },
  { label: __('Info', 'yaymail'), value: 'info', color: '#5bc0de' },
  { label: __('Success', 'yaymail'), value: 'success', color: '#5cb85c' },
  { label: __('Warning', 'yaymail'), value: 'warning', color: '#f0ad4e' },
  { label: __('Danger', 'yaymail'), value: 'danger', color: '#d9534f' },
];

export const WEIGHT_OPTIONS = [
  { label: __('Inherit', 'yaymail'), value: 'inherit' },
  { label: __('Normal', 'yaymail'), value: 'normal' },
  { label: __('Bold', 'yaymail'), value: 'bold' },
  { label: __('Bolder', 'yaymail'), value: 'bolder' },
  { label: __('Lighter', 'yaymail'), value: 'lighter' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
  { label: '300', value: '300' },
  { label: '400', value: '400' },
  { label: '500', value: '500' },
  { label: '600', value: '600' },
  { label: '700', value: '700' },
  { label: '800', value: '800' },
  { label: '900', value: '900' },
];

export const BUTTON_WIDTH_OPTIONS = [
  { label: __('Auto', 'yaymail'), value: 'auto' },
  { label: __('25%', 'yaymail'), value: '25%' },
  { label: __('50%', 'yaymail'), value: '50%' },
  { label: __('75%', 'yaymail'), value: '75%' },
  { label: __('100%', 'yaymail'), value: '100%' },
  { label: __('Custom', 'yaymail'), value: 'custom' },
];

export const TITLE_SIZE_OPTIONS = [
  { label: __('Default', 'yaymail'), value: 'default', size: 26 },
  { label: __('Small', 'yaymail'), value: 'small', size: 15 },
  { label: __('Medium', 'yaymail'), value: 'medium', size: 19 },
  { label: __('Large', 'yaymail'), value: 'large', size: 29 },
  { label: __('XL', 'yaymail'), value: 'xl', size: 39 },
  { label: __('XXL', 'yaymail'), value: 'xxl', size: 59 },
];

export const DIVIDER_TYPE_OPTIONS = [
  { label: __('Solid', 'yaymail'), value: 'solid' },
  { label: __('Double', 'yaymail'), value: 'double' },
  { label: __('Dotted', 'yaymail'), value: 'dotted' },
  { label: __('Dashed', 'yaymail'), value: 'dashed' },
];

export const SOCIAL_ICON_THEMES: DefaultOptionType[] | undefined =
  window.yaymailData.builder.social_icons?.themes?.map((theme) => ({
    key: theme,
    value: theme,
    label: __(pascalCaseToCapitalizedWords(theme)),
  }));

export const BORDER_STYLES_OPTION: Array<{ label: string; value: 'solid' | 'dashed' | 'dotted' }> =
  [
    {
      label: __('Solid', 'yaymail'),
      value: 'solid',
    },
    {
      label: __('Dashed', 'yaymail'),
      value: 'dashed',
    },
    {
      label: __('Dotted', 'yaymail'),
      value: 'dotted',
    },
  ];
