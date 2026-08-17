import { useMemo } from 'react';

import { IElement } from '@src/features/email-customizer/type';
import { getStylesData } from '@src/features/email-customizer/utils';
import useAddonStore from '@src/stores/addonStore';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import { getValueByPath, isDefined } from '@yaymail/utilities/src/functions';

import {
  Align,
  BackgroundImage,
  Border,
  BorderRadius,
  CheckboxGroup,
  Color,
  ColumnBorders,
  ColumnWidth,
  CustomFooterRows,
  DatePicker,
  Dimension,
  EntitiesSelector,
  GroupDefinition,
  HookSelector,
  ImageBox,
  ImageList,
  LineBreaker,
  Media,
  NumberColumn,
  NumberInput,
  OrderProgressCurrentStep,
  OrderProgressFilledBarBorderRadius,
  OrderProgressQuickPresets,
  OrderProgressSteps,
  RichTextEditor,
  Selector,
  SocialList,
  Spacing,
  Switcher,
  TextFormatToggles,
  TextInput,
  TextList,
} from '../property-builders';
import { PropertyBuilderComponentType, PropertyBuilderPropType } from '../types';
import CrossLink from './cross-link';
import Common from './element-property/common';
import {
  BUTTON_TYPE_OPTIONS,
  BUTTON_WIDTH_OPTIONS,
  DIVIDER_TYPE_OPTIONS,
  FONT_FAMILY_OPTION_ELEMENTS,
  SOCIAL_ICON_THEMES,
  TITLE_SIZE_OPTIONS,
  WEIGHT_OPTIONS,
} from './element-property/utils';

import '../property-builders/common.scss';

export type BuilderConcreteType = {
  Component: PropertyBuilderComponentType<any>;
  props?: PropertyBuilderPropType<any>;
};

const EditorBuilder = () => {
  const addonCustomEditors = useAddonStore((state) => state.addonCustomPropertyEditors);
  const chosenElementType = useTemplateContentStore((state) => state.chosenElement?.type);
  const chosenElement = useTemplateContentStore((state) => state.chosenElement);
  const chosenElementData = useMemo(() => chosenElement?.data, [chosenElement]);

  const updateChosenElementData = useTemplateContentStore((state) => state.updateChosenElementData);
  const amountOfChildren =
    useTemplateContentStore((state) => state.chosenElement?.children?.length) ?? 0;
  if (!chosenElementType) return null;

  const allElements = useCustomizerPageStore((state) => state.elements);

  // Map the element to add component, default_value, title ...
  const chosenElementEnhancedData = useMemo(() => {
    if (!allElements || allElements.length === 0) return undefined;

    // defaultData: IElement['data'];

    let defaultData: any = allElements.find(
      (e) =>
        (e.type === chosenElement?.type && chosenElement?.type !== 'column_layout') ||
        (chosenElement?.type === 'column_layout' &&
          (chosenElementData as any)?.amount_of_columns ==
            (e.data as any)?.amount_of_columns?.default_value),
    )?.data;

    // check if chosenElement is virtual
    if (chosenElement?.virtual) {
      if (chosenElement?.type === 'column_layout' && defaultData.length === 0) {
        defaultData = allElements.find((e) => e.type === chosenElement?.type)?.data;
      }
      // only get styles data
      const stylesData = getStylesData(chosenElement?.type, chosenElementData as any);

      // update defaultData only get key from stylesData
      defaultData = Object.keys(stylesData).reduce((acc, key) => {
        acc[key] = defaultData[key];
        return acc;
      }, {} as Record<string, any>);
    }

    if (!defaultData) return undefined;

    let newData = structuredClone(defaultData);

    const keys = Object.keys(newData);

    keys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(newData[key], 'default_value')) {
        newData[key].default_value = (chosenElementData as any)[key];
      } else {
        newData[key] = { ...newData[key], ...(chosenElementData as any)[key] };
      }
    });
    return newData;
  }, [allElements, chosenElement?.type, chosenElementData]);

  const getElementProperty = (elementData: IElement['data']) => {
    let result: BuilderConcreteType[] = [];

    Object.values(elementData).map(
      (data: {
        component?: string;
        default_value?: string;
        value_path?: string;
        title?: string;
        [key: string]: any;
      }) => {
        const conditions = data.conditions ?? {};
        const multiAttributes = conditions['multi_attributes'] ?? false;
        const explicitOperator = conditions['operator'];
        const operator = explicitOperator ?? (multiAttributes ? 'and' : 'or');
        const compareFunc = operator === 'or' ? 'some' : 'every';
        const conditionList = Object.values(conditions).filter(
          (c: any) => c && typeof c === 'object' && 'attribute' in c,
        );
        let canRender = false;
        const evaluateCondition = (condition: any) => {
          if (!(elementData as any)[condition.attribute]) {
            return true;
          }
          const compareValuePath = (elementData as any)[condition.attribute].value_path ?? '';
          const value = getValueByPath(chosenElementData, compareValuePath) ?? '';
          if (condition.comparison === '!=') {
            return value !== condition.value;
          }
          if (value && condition.comparison === 'contain' && Array.isArray(condition.value)) {
            return condition.value.every((v: string) => value.includes(v));
          }
          if (value && condition.comparison === 'exclude' && Array.isArray(condition.value)) {
            return condition.value.every((v: string) => !value.includes(v));
          }
          return value === condition.value;
        };
        if (!multiAttributes) {
          canRender = (conditionList as any)[compareFunc](evaluateCondition);
        } else {
          canRender = (conditionList as any)[compareFunc](evaluateCondition);
        }

        if (conditionList.length > 0 && !canRender) {
          return;
        }

        switch (data.component) {
          case 'LineBreaker':
            result.push({
              Component: LineBreaker,
              props: {
                ...data,
              },
            });
            break;
          case 'GroupDefinition':
            result.push({
              Component: GroupDefinition,
              props: {
                ...data,
              },
            });
            break;
          case 'Align':
            result.push({
              Component: Align,
              props: {
                ...data,
              },
            });
            break;
          case 'Spacing':
            result.push({
              Component: Spacing,
              props: {
                ...data,
              },
            });
            break;
          case 'BorderRadius':
            result.push({
              Component: BorderRadius,
              props: {
                ...data,
              },
            });
            break;
          case 'Media':
            result.push({
              Component: Media,
              props: {
                ...data,
              },
            });
            break;
          case 'Dimension':
            result.push({
              Component: Dimension,
              props: {
                ...data,
              },
            });
            break;
          case 'Color':
            result.push({
              Component: Color,
              props: {
                ...data,
              },
            });
            break;
          case 'TextInput':
            result.push({
              Component: TextInput,
              props: {
                ...data,
              },
            });
            break;
          case 'Selector':
            result.push({
              Component: Selector,
              props: {
                ...data,
              },
            });
            break;
          case 'EntitiesSelector':
            result.push({
              Component: EntitiesSelector,
              props: {
                ...data,
              },
            });
            break;

          case 'FontFamilySelector':
            result.push({
              Component: Selector,
              props: {
                ...data,
                children: FONT_FAMILY_OPTION_ELEMENTS,
              },
            });

            break;

          case 'FontSizeSelector':
            result.push({
              Component: Selector,
              props: {
                options: TITLE_SIZE_OPTIONS,
                ...data,
              },
            });

            break;

          case 'ButtonTypeSelector':
            result.push({
              Component: Selector,
              props: {
                options: BUTTON_TYPE_OPTIONS,
                onChange: (value: string) => {
                  if (!chosenElementData) return;
                  const selectedButtonType = BUTTON_TYPE_OPTIONS.find((t) => t.value === value);
                  const selectedColor = selectedButtonType?.color || '';

                  updateChosenElementData(
                    (draftData: any) => {
                      draftData.button_type = selectedButtonType;
                      draftData.button_background_color = selectedColor;
                    },
                    { attribute: data.title },
                  );
                },
                ...data,
              },
            });
            break;
          case 'FontWeightSelector':
            result.push({
              Component: Selector,
              props: {
                options: WEIGHT_OPTIONS,
                ...data,
              },
            });

            break;
          case 'ButtonWidthSelector':
            result.push({
              Component: Selector,
              props: {
                options: BUTTON_WIDTH_OPTIONS,
                ...data,
              },
            });
            break;

          case 'SocialIconThemeSelector':
            result.push({
              Component: Selector,
              props: {
                options: SOCIAL_ICON_THEMES,
                ...data,
              },
            });

            break;

          case 'DividerTypeSelector':
            result.push({
              Component: Selector,
              props: {
                options: DIVIDER_TYPE_OPTIONS,
                ...data,
              },
            });

            break;

          case 'RichTextEditor':
            result.push({
              Component: RichTextEditor,
              props: {
                ...data,
              },
            });
            break;
          case 'SocialList':
            result.push({
              Component: SocialList,
              props: {
                ...data,
              },
            });
            break;
          case 'NumberColumn':
            result.push({
              Component: NumberColumn,
              props: {
                ...data,
              },
            });
            break;
          case 'ImageList':
            result.push({
              Component: ImageList,
            });
            break;
          case 'ImageBox':
            result.push({
              Component: ImageBox,
            });
            break;
          case 'TextList':
            result.push({
              Component: TextList,
            });
            break;
          case 'OrderProgressQuickPresets':
            result.push({
              Component: OrderProgressQuickPresets,
              props: {
                ...data,
              },
            });
            break;
          case 'OrderProgressSteps':
            result.push({
              Component: OrderProgressSteps,
              props: {
                ...data,
              },
            });
            break;
          case 'OrderProgressCurrentStep':
            result.push({
              Component: OrderProgressCurrentStep,
              props: {
                ...data,
              },
            });
            break;
          case 'OrderProgressFilledBarBorderRadius':
            result.push({
              Component: OrderProgressFilledBarBorderRadius,
              props: {
                ...data,
              },
            });
            break;
          case 'CustomFooterRowsEditor':
            result.push({
              Component: CustomFooterRows,
              props: {
                ...data,
              },
            });
            break;
          case 'BackgroundImage':
            result.push({
              Component: BackgroundImage,
              props: {
                url_input_place_holder: 'Eg: https://example.com/image.png',
                show_delete_button: true,
                hide_preview_on_empty_url: true,
                ...data,
              },
            });
            break;
          case 'ColumnWidth':
            result.push({
              Component: ColumnWidth,
              props: {
                title: data.title,
                amount: data.default_value,
              },
            });
            break;
          case 'ColumnBorders':
            result.push({
              Component: ColumnBorders,
              props: {
                ...data,
              },
            });
            break;
          case 'HookSelector':
            result.push({
              Component: HookSelector,
              props: {
                ...data,
              },
            });
            break;
          case 'NumberInput':
            result.push({
              Component: NumberInput,
              props: {
                ...data,
                style: { width: '65px' },
              },
            });
            break;
          case 'CheckboxGroup':
            result.push({
              Component: CheckboxGroup,
              props: {
                ...data,
              },
            });
            break;
          case 'Switcher':
            result.push({
              Component: Switcher,
              props: {
                ...data,
              },
            });
            break;
          case 'TextFormatToggles':
            result.push({
              Component: TextFormatToggles,
              props: {
                ...data,
              },
            });
            break;
          case 'DatePicker':
            result.push({
              Component: DatePicker,
              props: {
                ...data,
              },
            });
            break;
          case 'Border':
            result.push({
              Component: Border,
              props: {
                ...data,
                default_value: data.default_value ?? {
                  side: 'none',
                  width: 1,
                  style: 'solid',
                  color: '#e5e5e5',
                  custom: {
                    left: 1,
                    top: 1,
                    right: 1,
                    bottom: 1,
                  },
                },
              },
            });
            break;
          default: {
            // Handle addons custom editors
            // if (/addon_/i.test(data.component ?? '')) {
            // }
            // No need to check addon name, just check if the component is defined
            const addonCustomEditor =
              addonCustomEditors.find((e) => e.name === data.component)?.component ?? null;
            if (!isDefined(addonCustomEditor)) break;
            result.push({
              Component: addonCustomEditor,
              props: { ...data },
            });

            break;
          }
        }
      },
    );
    return result;
  };

  const propertyBuilders = useMemo(() => {
    let result: BuilderConcreteType[] = [];
    if (chosenElementEnhancedData !== undefined) {
      result = getElementProperty(chosenElementEnhancedData);
    }

    result = result.concat(Common);
    if (chosenElement?.virtual) {
      return result;
    }
    return result;
  }, [chosenElementType, chosenElementEnhancedData, amountOfChildren, chosenElement?.virtual]);

  if (propertyBuilders.length === 0) {
    if (chosenElement?.virtual) {
      return (
        <div className="yaymail-editor-property">
          <div className="yaymail-title"> {__('No common settings', 'yaymail')}</div>
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      {propertyBuilders.map(({ Component, props }, index) => {
        if (Component) {
          return <Component key={chosenElement?.id + (props?.value_path ?? index)} {...props} />;
        }
        return null;
      })}
      {
        // only show cross link if window.yaymailData has property conditional_logic
        !isDefined(window.yaymailData, 'conditional_logic') && <CrossLink />
      }
    </>
  );
};

export default EditorBuilder;
