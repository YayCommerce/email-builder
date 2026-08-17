import { __ } from '@wordpress/i18n';

import { BackgroundImage, Color, ColumnWidth, Spacing } from '../../property-builders';
import {} from '../../property-builders';
import { BackgroundImageType } from '../../property-builders/common/background-image/type';
import { ColorType } from '../../property-builders/common/color/type';
import { ColumnWidthType } from '../../property-builders/common/column-width/type';
import { SpacingType } from '../../property-builders/common/spacing/type';
import { PropertyBuilderPropType } from '../../types';
import { BuilderConcreteType } from '..';

const ColumnLayout = (amountOfChildren: number) => {
  const ColumnWidthBuilder =
    amountOfChildren > 1
      ? {
          Component: ColumnWidth,
          props: { amount: amountOfChildren } as PropertyBuilderPropType<ColumnWidthType>,
        }
      : null;

  return [
    ColumnWidthBuilder,
    {
      Component: Spacing,
      props: {
        title: 'Padding',
      } as PropertyBuilderPropType<SpacingType>,
    },
    {
      Component: Color, // Background color
      props: {
        attribute: 'background_color',
        title: __('Background color', 'yaymail'),
      } as PropertyBuilderPropType<ColorType>,
    },
    {
      Component: Color, // Background color for inner element
      props: {
        title: __('Inner background color', 'yaymail'),
        attribute: 'inner_background_color',
      } as PropertyBuilderPropType<ColorType>,
    },
    {
      Component: Spacing,
      props: {
        title: 'Inner border radius',
        attribute: 'inner_border_radius',
        subAttributes: [
          { key: 'topLeft', label: 'Top left' },
          { key: 'topRight', label: 'Top right' },
          { key: 'bottomLeft', label: 'bottom left' },
          { key: 'bottomRight', label: 'Bottom right' },
        ],
        className: 'yaymail-inner-border-radius',
      } as PropertyBuilderPropType<SpacingType>,
    },

    {
      Component: BackgroundImage,
      props: {
        title: __('Background image', 'yaymail'),
        urlInputPlaceHolder: 'Eg: https://example.com/image.png',
        showDeleteButton: true,
        hidePreviewOnEmptyUrl: true,
      } as PropertyBuilderPropType<BackgroundImageType>,
    },
  ].filter((e) => e !== null) as BuilderConcreteType[];
};

export default ColumnLayout;
