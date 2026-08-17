import { LayoutType } from './layouts/type';
import { AlignType } from './property-builders/common/align/type';
import { BorderType } from './property-builders/common/border/type.';
import { CheckboxGroupType } from './property-builders/common/checkbox-group/type';
import { ColorType } from './property-builders/common/color/type';
import { ColumnWidthType } from './property-builders/common/column-width/type';
import { DatePickerType } from './property-builders/common/date-picker/type';
import { DimensionType } from './property-builders/common/dimension/type';
import { ImageType } from './property-builders/common/media/type';
import { NumberInputType } from './property-builders/common/number-input/type';
import { RichTextEditorType } from './property-builders/common/rich-text-editor/type';
import { SelectorType } from './property-builders/common/selector/type';
import { SpacingType } from './property-builders/common/spacing/type';
import { InputType } from './property-builders/common/text-input/type';
import { SocialListType } from './property-builders/social/social-list/type';
import { TextFormatTogglesType } from './property-builders/common/text-format-toggles/type';

/* eslint-disable no-unused-vars */

export type PropertyBuilderTypes =
  | AlignType
  | BorderType
  | ColorType
  | InputType
  | SpacingType
  | DimensionType
  | SelectorType
  | RichTextEditorType
  | ImageType
  | SocialListType
  | LayoutType
  | ColumnWidthType
  | CheckboxGroupType
  | NumberInputType
  | AlignType
  | TextFormatTogglesType
  | null
  | DatePickerType;
interface IPropertyBuilderCommonProps {
  title?: string;
}

// TODO this type doesn't work right when using type assertion 'as'
export type PropertyBuilderPropType<T extends PropertyBuilderTypes = null> =
  IPropertyBuilderCommonProps & T;

export type PropertyBuilderComponentType<T extends PropertyBuilderTypes = null> = (
  props?: PropertyBuilderPropType<T>,
) => JSX.Element | null;
