import { useCallback, useMemo } from 'react';

import { Select } from 'antd';

import { normalizeOrderProgressSteps } from '@src/features/email-customizer/components/email-template-container/elements/order-progress/step-data';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../types';

type OrderProgressCurrentStepProps = {
  value_path?: string;
  title?: string;
  default_value?: number;
};

const OrderProgressCurrentStep: PropertyBuilderComponentType<OrderProgressCurrentStepProps> = (
  props?,
) => {
  const valuePath = useMemo(() => props?.value_path ?? 'current_step_index', [props?.value_path]);
  const title = useMemo(() => props?.title ?? __('Active step', 'yaymail'), [props?.title]);

  const steps = useTemplateContentStore((state) => {
    const raw = getValueByPath(state.chosenElement?.data, 'steps');
    return normalizeOrderProgressSteps(raw);
  });

  const currentIndex = useTemplateContentStore((state) => {
    const raw = getValueByPath(state.chosenElement?.data, valuePath);
    const n = Number(raw ?? props?.default_value ?? 0);
    return Number.isFinite(n) ? Math.floor(n) : 0;
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const options = useMemo(() => {
    return steps.map((step: any, idx: number) => ({
      label: step?.label ? `${idx + 1}. ${step.label}` : `${__('Step', 'yaymail')} ${idx + 1}`,
      value: String(idx),
    }));
  }, [steps]);

  const handleOnChange = useCallback(
    (value: string) => {
      const n = Number(value);
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, Number.isFinite(n) ? n : 0);
        },
        { attribute: title },
      );
    },
    [title, updateChosenElementData, valuePath],
  );

  return (
    <div className="yaymail-editor-property yaymail-editor-property-order-progress-current-step">
      <div className="yaymail-title">{title}</div>
      <Select
        className="yaymail-custom-input"
        value={String(Math.max(0, Math.min(currentIndex, Math.max(0, options.length - 1))))}
        options={options}
        onChange={handleOnChange}
        style={{ width: '100%' }}
      />
    </div>
  );
};

export default OrderProgressCurrentStep;
