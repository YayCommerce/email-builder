import { __ } from '@wordpress/i18n';

import { GroupDefinition, LineBreaker, Margin, TextInput } from '../../property-builders';
import { InputType } from '../../property-builders/common/text-input/type';
import { PropertyBuilderPropType } from '../../types';

const Common = [
  {
    Component: LineBreaker,
  },
  {
    Component: GroupDefinition,
    props: {
      title: __('Optional settings', 'yaymail'),
    },
  },
  {
    Component: Margin,
    props: {
      title: __('Margin', 'yaymail'),
      description: __(
        'Limited support in some email clients (e.g. Outlook). Use padding for reliable spacing.',
        'yaymail',
      ),
      value_path: 'margin',
    },
  },
  {
    Component: TextInput,
    props: {
      title: __('CSS classes', 'yaymail'),
      attribute: 'custom_css_classes',
      value_path: 'custom_css_classes',
      initialValue: '',
      placeholder: __('Eg: classname-a classname-b', 'yaymail'),
    } as PropertyBuilderPropType<InputType>,
  },
];

export default Common;
