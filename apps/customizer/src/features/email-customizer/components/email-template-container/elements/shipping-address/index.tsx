import { CSSProperties, useMemo } from 'react';

import EditZone from '@src/components/edit-zone';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
// eslint-disable-next-line no-restricted-imports
import { getDimensionValue } from '@src/features/email-customizer/utils';
import { __ } from '@wordpress/i18n';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

const ShippingAddressContent = ({ element }: ITemplateProps<'shipping_address'>) => {
  const data = element.data;

  const { doShortcode } = useShortcode();
  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),

      backgroundColor: data.background_color || 'transparent',
      fontFamily: data.font_family ?? 'initial',
    }),
    [data],
  );

  const textStyles: CSSProperties = useMemo(
    () => ({
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
      padding: getDimensionValue(12),
      border: `1px solid ${data.border_color ?? '#e5e5e5'}`,
      fontSize: getDimensionValue(data.shipping_content_font_size ?? 14),
      textAlign: data.shipping_content_alignment ?? 'left',
    }),
    [data.text_color, getDimensionValue, data.border_color, data.shipping_content_font_size, data.shipping_content_alignment],
  );

  const titleStyles: CSSProperties = useMemo(
    () => ({
      color: data.title_color ?? YAYMAIL_TOKENS.color.black[700],
      margin: '0 0 7px 0',
      fontSize: getDimensionValue(20),
      fontWeight: 600,
    }),
    [data.title_color, getDimensionValue],
  );

  const shortcodedTitle = useMemo(() => doShortcode(data.title ?? ''), [data.title, doShortcode]);

  const shortcodedContent = useMemo(
    () => doShortcode(data.rich_text ?? ''),
    [data.rich_text, doShortcode],
  );

  const isLayoutTypeModern = useMemo(() => data.layout_type === 'modern', [data.layout_type]);

  const tableData = useMemo(
    () => ({
      ...(isLayoutTypeModern ? { 'data-layout-type-modern': true } : {}),
    }),
    [isLayoutTypeModern],
  );

  const shippingContentTextFormat = data?.shipping_content_text_format ?? {
    bold: false,
    italic: true,
    underline: false,
  };

  const elementSpecificStyles = useMemo(
    () => `
    .yaymail-element-${element.id} .yaymail-shipping-address-wrap[data-layout-type-modern] {
      border: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .yaymail-element-${element.id} .yaymail-shipping-address-wrap address {
      font-weight: ${shippingContentTextFormat.bold ? 'bold' : 'normal'} !important;
      font-style: ${shippingContentTextFormat.italic ? 'italic' : 'normal'} !important;
      text-decoration: ${shippingContentTextFormat.underline ? 'underline' : 'none'} !important;
    }
  `,
    [element.id, shippingContentTextFormat],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-shipping_addrees"
      element={element}
      style={wrapperStyles}
    >
      <style>{elementSpecificStyles}</style>
      <EditZone
        element={element}
        valuePath="title"
        displayHtml={shortcodedTitle}
        className="yaymail-shipping-title"
        style={titleStyles}
        attributeLabel="Shipping title"
      />
      {shortcodedContent ? (
        <div
          className="yaymail-shipping-address-wrap"
          style={textStyles}
          dangerouslySetInnerHTML={{ __html: shortcodedContent }}
          {...tableData}
        />
      ) : (
        <div className="yaymail-shipping-address-wrap" style={textStyles} {...tableData}>
          <address>{__('No Shipping address set.', 'yaymail')}</address>
        </div>
      )}
    </ElementWrapper>
  );
};

const ShippingAddress = withMemo(ShippingAddressContent);

export default ShippingAddress;
