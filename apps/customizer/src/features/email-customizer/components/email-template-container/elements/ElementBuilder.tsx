import { useMemo } from 'react';

import { getAddonElementComponent } from '@src/addon-utils';
import { IElement } from '@src/features/email-customizer/type';
import { isDefined } from '@yaymail/utilities/src/functions';

import EmailRecursiveElements from '../email-recursive-element';
import {
  BillingAddress,
  BillingShippingAddress,
  Button,
  Column,
  ColumnLayout,
  Divider,
  Footer,
  Heading,
  Hook,
  Html,
  Image,
  ImageBox,
  ImageList,
  Logo,
  OrderDetails,
  OrderDetailsDownload,
  OrderProgress,
  RatingStars,
  ShippingAddress,
  SkeletonDivider,
  Social,
  Space,
  Text,
  TextList,
  Title,
  Video,
} from './';

export interface IElementBuilderProps {
  element: IElement;
  columnIndex?: number;
  parentId?: IElement['parentId'];
  chosenId?: IElement['id'];
}

export const ElementBuilder = ({ element, columnIndex, parentId }: IElementBuilderProps) => {
  const componentKey = useMemo(() => element.id, [element.id]);

  const AddonElement = getAddonElementComponent(element.type);

  switch (element.type) {
    case 'logo':
      return <Logo element={element as IElement<'logo'>} key={componentKey} />;

    case 'heading':
      return <Heading element={element as IElement<'heading'>} key={componentKey} />;

    case 'video':
      return <Video element={element as IElement<'video'>} key={componentKey} />;

    case 'image':
      return <Image element={element as IElement<'image'>} key={componentKey} />;

    case 'image_box':
      return <ImageBox element={element as IElement<'image_box'>} key={componentKey} />;

    case 'image_list':
      return <ImageList element={element as IElement<'image_list'>} key={componentKey} />;

    case 'title':
      return <Title element={element as IElement<'title'>} key={componentKey} />;

    case 'button':
      return <Button element={element as IElement<'button'>} key={componentKey} />;

    case 'text':
      return <Text element={element as IElement<'text'>} key={componentKey} />;

    case 'text_list':
      return <TextList element={element as IElement<'text_list'>} key={componentKey} />;

    case 'footer':
      return <Footer element={element as IElement<'footer'>} key={componentKey} />;

    case 'html':
      return <Html element={element as IElement<'html'>} key={componentKey} />;

    case 'space':
      return <Space element={element as IElement<'space'>} key={componentKey} />;

    case 'divider':
      return <Divider element={element as IElement<'divider'>} key={componentKey} />;

    case 'column_layout':
      return (
        <ColumnLayout element={element as IElement<'column_layout'>} key={componentKey}>
          <ColumnChildren parentId={element.id} elements={element.children} />
        </ColumnLayout>
      );

    case 'column':
      if (!isDefined(columnIndex)) return null;
      return (
        <Column
          columnIndex={columnIndex}
          key={componentKey}
          element={element as IElement<'column'>}
          list={element.children}
          parentId={parentId}
          width={(element.data as any).width}
        >
          <ColumnChildren parentId={element.id} elements={element.children} />
        </Column>
      );

    case 'shipping_address':
      return (
        <ShippingAddress element={element as IElement<'shipping_address'>} key={componentKey} />
      );

    case 'billing_shipping_address':
      return (
        <BillingShippingAddress
          element={element as IElement<'billing_shipping_address'>}
          key={componentKey}
        />
      );

    case 'billing_address':
      return <BillingAddress element={element as IElement<'billing_address'>} key={componentKey} />;

    case 'social_icon':
      return <Social element={element as IElement<'social_icon'>} key={componentKey} />;

    case 'hook':
      return <Hook element={element as IElement<'hook'>} key={componentKey} />;

    case 'order_details':
      return <OrderDetails element={element as IElement<'order_details'>} key={componentKey} />;

    case 'order_details_download':
      return (
        <OrderDetailsDownload
          element={element as IElement<'order_details_download'>}
          key={componentKey}
        />
      );

    case 'order_progress':
      return <OrderProgress element={element as IElement<'order_progress'>} key={componentKey} />;

    case 'skeleton_divider':
      return <SkeletonDivider />;

    case 'rating_stars':
      return <RatingStars element={element as IElement<'rating_stars'>} key={componentKey} />;

    default:
      // TODO: consider why do this test?
      // if (/addon_/i.test(element.type)) {
      //   // Is Addon element
      // return AddonElement !== null ? <AddonElement element={element} key={componentKey} /> : null;
      // }
      // return null;
      return AddonElement !== null ? <AddonElement element={element} key={componentKey} /> : null;
  }
};

const ColumnChildren = ({
  parentId,
  elements,
}: {
  parentId: IElement['id'];
  elements: IElement['children'];
  borderRadius?: {};
}) => {
  if (!elements) return null;
  return <EmailRecursiveElements parentId={parentId} list={elements} />;
};
