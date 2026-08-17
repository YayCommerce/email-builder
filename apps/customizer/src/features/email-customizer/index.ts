import EmailCustomizer from './components';
import Sidebar from './components/sidebar';
import { DimensionType } from './components/sidebar/element-editor/property-builders/common/dimension/type';
import { ImageType } from './components/sidebar/element-editor/property-builders/common/media/type';
import { AlignType, ElementDataTypeMap, ElementType, IElement, SpacingType } from './type';
export default EmailCustomizer;
export { Sidebar };

export type {
  AlignType,
  DimensionType,
  ElementDataTypeMap,
  ElementType,
  IElement,
  SpacingType,
  ImageType,
};
