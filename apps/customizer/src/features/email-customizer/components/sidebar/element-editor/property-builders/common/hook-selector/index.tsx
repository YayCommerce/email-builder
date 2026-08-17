import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';

import { Select } from 'antd';

// eslint-disable-next-line no-restricted-imports
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import { PropertyBuilderComponentType } from '../../../types';
import SelectorBase from '../../base/selector-base';
import { SelectorType } from '../selector/type';
import TextInput from '../text-input';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

const { Option } = Select;
const SUPPORTED_HOOKS = [
  'woocommerce_email_before_order_table',
  'woocommerce_email_after_order_table',
  'yaydp_on_sale_products',
];

const INITIAL_CUSTOM_HOOK = formatCustomShortcode('your_hook');

const generateOptions = (optionsArray: Array<string>) => {
  return (
    <>
      {optionsArray.map((option) => (
        <Option value={formatCustomShortcode(option)} label={option} key={option}>
          <span>{option}</span>
        </Option>
      ))}
      <Option value={INITIAL_CUSTOM_HOOK} key="custom">
        <span>{__('Custom', 'yaymail')}</span>
      </Option>
    </>
  );
};

const SUPPORTED_HOOK_OPTIONS = generateOptions(SUPPORTED_HOOKS);

const HookSelector: PropertyBuilderComponentType<SelectorType> = (props) => {
  const valuePath = props?.value_path ?? 'hook_shortcode';
  const title = props?.title ?? __('Hook shortcode', 'yaymail');

  const dataValue = useTemplateContentStore((state) =>
    getValueByPath(state.chosenElement?.data, valuePath),
  );

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const updateHook = useCallback(
    (hook: string) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, hook);
        },
        { attribute: title },
      );
    },
    [updateChosenElementData, valuePath],
  );

  const selectorValue: string = useMemo(() => {
    return SUPPORTED_HOOKS.some((shortcode) => dataValue?.includes(shortcode))
      ? dataValue
      : INITIAL_CUSTOM_HOOK;
  }, [dataValue]);

  const [isCustomHook, setIsCustomHook] = useState<boolean>(selectorValue === INITIAL_CUSTOM_HOOK);

  const onSelectorChange = useCallback(
    (hook: string) => {
      if (hook === INITIAL_CUSTOM_HOOK) {
        setIsCustomHook(true);
      } else {
        setIsCustomHook(false);
      }
      updateHook(hook);
    },
    [setIsCustomHook, updateHook],
  );

  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const onTextInputChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = useCallback(
    (e) => {
      if (!e.target.value) return;

      if (/^\[yaymail_custom_hook(?=.*\bhook=".+").*]$/.test(e.target.value)) {
        setValidationMessage(null);
      } else {
        setValidationMessage('Valid shortcode should look like: ' + INITIAL_CUSTOM_HOOK);
      }

      updateHook(e.target.value);
    },
    [updateHook, setValidationMessage],
  );

  return (
    <>
      <SelectorBase title={title} value={selectorValue} onChange={onSelectorChange}>
        {SUPPORTED_HOOK_OPTIONS}
      </SelectorBase>
      {isCustomHook && (
        <TextInput
          title={__('Custom Hook', 'yaymail')}
          value={dataValue}
          onChange={onTextInputChange}
          validation_message={validationMessage}
        />
      )}
    </>
  );
};

export default HookSelector;

function formatCustomShortcode(inputString: string): string {
  if (!inputString) return '';
  if (!inputString.startsWith('[yaymail_custom_hook hook="')) {
    inputString = `[yaymail_custom_hook hook="${inputString}"`;
  }

  if (inputString.includes('yaydp_on_sale_products')) {
    inputString += ' limit="6" ';
    inputString += ' sale_price_color="#ec4770" ';
    inputString += ' regular_price_color="#808080" ';
    inputString += ' product_name_color="#636363" ';
    inputString += ' button_background_color="#ec4770" ';
    inputString += ' button_text_color="#ffffff" ';
  }

  if (!inputString.endsWith(']')) {
    inputString += ']';
  }

  return inputString;
}
