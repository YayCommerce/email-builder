import { useCallback, useMemo, useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';

import {
  createEmptyOrderProgressStep,
  normalizeOrderProgressSteps,
  ORDER_PROGRESS_MAX_STEPS,
} from '@src/features/email-customizer/components/email-template-container/elements/order-progress/step-data';
import type { OrderProgressStep } from '@src/features/email-customizer/components/email-template-container/elements/order-progress/variants/types';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, setValueByPath } from '@yaymail/utilities/src/functions';

import { PropertyBuilderComponentType } from '../../types';
import Color from '../common/color';
import Dimension from '../common/dimension';
import Media from '../common/media';
import Selector from '../common/selector';
import TextInput from '../common/text-input';

import './index.scss';

const ICON_BORDER_STYLE_OPTIONS = [
  { value: 'solid', label: __('Solid', 'yaymail') },
  { value: 'dashed', label: __('Dashed', 'yaymail') },
  { value: 'dotted', label: __('Dotted', 'yaymail') },
];

type OrderProgressStepsProps = {
  value_path?: string;
  title?: string;
  default_value?: OrderProgressStep[];
};

const OrderProgressSteps: PropertyBuilderComponentType<OrderProgressStepsProps> = (props?) => {
  const valuePath = useMemo(() => props?.value_path ?? 'steps', [props?.value_path]);
  const title = useMemo(() => props?.title ?? __('Steps', 'yaymail'), [props?.title]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const displayStyle =
    useTemplateContentStore(
      (state) =>
        (state.chosenElement?.type === 'order_progress' &&
          (state.chosenElement.data as any)?.display_style) ||
        undefined,
    ) ?? 'step_marker';

  const steps = useTemplateContentStore((state) => {
    const raw = getValueByPath(state.chosenElement?.data, valuePath);
    const normalized = normalizeOrderProgressSteps(raw);
    return normalized.length > 0 ? normalized : props?.default_value ?? [];
  });

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);

  const setSteps = useCallback(
    (nextSteps: OrderProgressStep[], attribute?: string) => {
      updateChosenElementData(
        (data) => {
          setValueByPath(data, valuePath, nextSteps);
        },
        { attribute: attribute ?? title },
      );
    },
    [updateChosenElementData, valuePath, title],
  );

  const addStep = useCallback(() => {
    if ((steps ?? []).length >= ORDER_PROGRESS_MAX_STEPS) {
      return;
    }
    const next = [...(steps ?? []), createEmptyOrderProgressStep()];
    setSteps(next, __('Add step', 'yaymail'));
    setOpenKeys((prev) => {
      const nextKey = `step-${next.length - 1}`;
      return prev.includes(nextKey) ? prev : [...prev, nextKey];
    });
  }, [setSteps, steps]);

  const removeStep = useCallback(
    (index: number) => {
      const next = (steps ?? []).filter((_, i) => i !== index);
      setSteps(next, __('Remove step', 'yaymail'));
      setOpenKeys((prev) =>
        prev
          .filter((k) => k !== `step-${index}`)
          .map((k) => {
            const match = /^step-(\d+)$/.exec(k);
            if (!match) return k;
            const idx = Number(match[1]);
            if (!Number.isFinite(idx)) return k;
            if (idx > index) return `step-${idx - 1}`;
            return k;
          }),
      );
    },
    [setSteps, steps],
  );

  const items = useMemo<MenuProps['items']>(() => {
    return (steps ?? []).map((step, index) => {
      const key = `step-${index}`;
      const labelText = `${__('Step', 'yaymail')} ${index + 1}${
        step?.title ? ` — ${step.title}` : ''
      }`;

      return {
        key,
        label: <span className="yaymail-order-progress-step-menu-title__text">{labelText}</span>,
        icon: (
          <span
            className="yaymail-delete-step-button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeStep(index);
            }}
            title={__('Delete this step', 'yaymail')}
            role="button"
          >
            <DeleteOutlined />
          </span>
        ),
        children: [
          {
            key: `${key}-content`,
            label: (
              <div className="order-progress-step-menu-content">
                <TextInput
                  title={__('Title', 'yaymail')}
                  value_path={`${valuePath}.${index}.title`}
                  placeholder={__('Eg: Processing', 'yaymail')}
                  rows={1}
                />

                <div style={{ marginBottom: '20px' }}>
                  <Media
                    title={__('Icon', 'yaymail')}
                    value_path={`${valuePath}.${index}.image_url`}
                    media_type="image"
                    button_title={__('Choose image', 'yaymail')}
                    show_preview
                    show_delete_button
                    hide_preview_on_empty_url
                    url_input_placeholder="Eg: https://example.com/icon.png"
                  />
                </div>

                <div className="order-progress-step-menu-content__row order-progress-step-menu-content__row--two-cols">
                  {displayStyle === 'filled_bar' && (
                    <Color
                      title={__('Icon border', 'yaymail')}
                      value_path={`${valuePath}.${index}.icon_border_color`}
                    />
                  )}

                  <Color
                    title={__('Icon background', 'yaymail')}
                    value_path={`${valuePath}.${index}.image_bg_color`}
                  />
                </div>

                {displayStyle === 'filled_bar' && (
                  <div className="order-progress-step-menu-content__row order-progress-step-menu-content__row--two-cols">
                    <Selector
                      title={__('Border style', 'yaymail')}
                      value_path={`${valuePath}.${index}.icon_border_style`}
                      options={ICON_BORDER_STYLE_OPTIONS}
                      default_value="solid"
                    />
                    <Dimension
                      title={__('Border width', 'yaymail')}
                      value_path={`${valuePath}.${index}.icon_border_width`}
                      min={0}
                      max={10}
                      default_value={2}
                    />
                  </div>
                )}
              </div>
            ),
          },
        ],
      };
    });
  }, [displayStyle, removeStep, steps, valuePath]);

  return (
    <div className="yaymail-editor-property yaymail-editor-property-order-progress-steps">
      <div className="order-progress-steps-header">
        <div className="yaymail-title">{title}</div>
      </div>

      {steps.length === 0 ? (
        <div className="order-progress-steps-empty">
          <p>{__('No steps added yet.', 'yaymail')}</p>
          <p>{__('Click "Add step" to create a new step.', 'yaymail')}</p>
        </div>
      ) : (
        <Menu
          className="yaymail-order-progress-steps-menu"
          mode="inline"
          theme="dark"
          items={items}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
        />
      )}

      {(steps ?? []).length < ORDER_PROGRESS_MAX_STEPS && (
        <div className="yaymail-add-step-button--container">
          <Button className="yaymail-add-step-button" type="text" onClick={addStep}>
            + {__('Add step', 'yaymail')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderProgressSteps;
