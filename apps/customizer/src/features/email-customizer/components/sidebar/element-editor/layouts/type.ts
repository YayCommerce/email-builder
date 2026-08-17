import { PropertyBuilderComponentType, PropertyBuilderPropType } from '../types';

export type LayoutType = {
  itemList: Array<{
    Component: PropertyBuilderComponentType<any>;
    props?: PropertyBuilderPropType<any>;
  }>;
};
