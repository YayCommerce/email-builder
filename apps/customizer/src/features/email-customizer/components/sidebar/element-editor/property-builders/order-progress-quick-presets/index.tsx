import { useCallback, useState } from 'react';

import type { RadioChangeEvent } from 'antd';
import { Radio } from 'antd';

import {
  getOrderProgressQuickPresetOptions,
  getOrderProgressQuickPresetPatch,
  mergePresetIntoSteps,
} from '@src/features/email-customizer/components/email-template-container/elements/order-progress/order-progress-quick-presets-definitions';
import type { OrderProgressStep } from '@src/features/email-customizer/components/email-template-container/elements/order-progress/variants/types';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import { PropertyBuilderComponentType } from '../../types';
import { SelectorType } from '../common/selector/type';

/**
 * Quick presets: radio strip (same pattern as NumberColumn) with 4 options; applies patch without persisting preset id.
 */
const OrderProgressQuickPresets: PropertyBuilderComponentType<SelectorType> = (props) => {
  const { title, options: optionsFromPhp } = props || {};
  const [lastSelected, setLastSelected] = useState<string | undefined>(undefined);

  const updateChosenElementData = useTemplateContentStore((s) => s.updateChosenElementData);

  const options =
    optionsFromPhp && optionsFromPhp.length > 0
      ? optionsFromPhp
      : getOrderProgressQuickPresetOptions();

  const handleChange = useCallback(
    (e: RadioChangeEvent) => {
      const value = e.target.value as string;
      if (value == null || value === '') {
        setLastSelected(undefined);
        return;
      }
      setLastSelected(value);
      const patch = getOrderProgressQuickPresetPatch(value);
      if (!patch) {
        return;
      }
      updateChosenElementData(
        (data) => {
          const d = data as Record<string, unknown>;
          (Object.entries(patch.elementStyle) as [string, unknown][]).forEach(([key, v]) => {
            if (v !== undefined) {
              d[key] = v;
            }
          });
          const currentStepIndex = Number(d.current_step_index ?? 0);
          d.steps = mergePresetIntoSteps(
            d.steps as OrderProgressStep[] | undefined,
            patch.activeStepStyle,
            patch.inactiveStepStyle,
            currentStepIndex,
          );
        },
        { attribute: title ?? __('Quick presets', 'yaymail') },
      );
    },
    [updateChosenElementData, title],
  );

  const displayTitle = title ?? __('Quick presets', 'yaymail');

  return (
    <div
      className={classNames(
        'yaymail-editor-property',
        'yaymail-editor-property-select-number',
        'yaymail-order-progress-quick-presets',
      )}
    >
      {title !== '' && <div className="yaymail-title">{displayTitle}</div>}
      <div className="yaymail-controls-container">
        <Radio.Group
          size="large"
          className="yaymail-select-number-radio-group"
          value={lastSelected}
          onChange={handleChange}
        >
          {options.map((opt, index) => (
            <Radio.Button
              key={opt.value}
              value={opt.value}
              className="yaymail-select-number-radio-group-option"
              title={typeof opt.label === 'string' ? opt.label : undefined}
            >
              <span>{index + 1}</span>
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </div>
  );
};

export default OrderProgressQuickPresets;
