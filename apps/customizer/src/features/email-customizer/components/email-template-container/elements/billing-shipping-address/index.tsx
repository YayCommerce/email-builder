import { CSSProperties, memo, useMemo } from 'react';

import EditZone from '@src/components/edit-zone';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { IElement, ITemplateProps } from '@src/features/email-customizer/type';
import { __ } from '@wordpress/i18n';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const BillingShippingAddressContent = ({ element }: ITemplateProps<'billing_shipping_address'>) => {
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

  const shortcodedBillingTitle = useMemo(
    () => doShortcode(data.billing_title ?? ''),
    [data.billing_title, doShortcode],
  );

  const shortcodedShippingTitle = useMemo(
    () => doShortcode(data.shipping_title ?? ''),
    [data.shipping_title, doShortcode],
  );

  const shortcodedBillingContent = useMemo(
    () => doShortcode(data.billing_address_content ?? ''),
    [data.billing_address_content, doShortcode],
  );

  const shortcodedShippingContent = useMemo(
    () => doShortcode(data.shipping_address_content ?? ''),
    [data.shipping_address_content, doShortcode],
  );

  const emptyBillingContent = useMemo(() => __('No Billing address set.', 'yaymail'), []);
  const emptyShippingContent = useMemo(() => __('No Shipping address set.', 'yaymail'), []);

  const isLayoutTypeModern = useMemo(() => data.layout_type === 'modern', [data.layout_type]);

  const tableData = useMemo(
    () => ({
      ...(isLayoutTypeModern ? { 'data-layout-type-modern': true } : {}),
    }),
    [isLayoutTypeModern],
  );

  const billingContentTextFormat = data?.billing_content_text_format ?? {
    bold: false,
    italic: true,
    underline: false,
  };

  const shippingContentTextFormat = data?.shipping_content_text_format ?? {
    bold: false,
    italic: true,
    underline: false,
  };
  const billingContentAlignment = data?.billing_content_alignment ?? 'left';
  const shippingContentAlignment = data?.shipping_content_alignment ?? 'left';

  const elementSpecificStyles = useMemo(
    () => `
    .yaymail-element-${element.id} .yaymail-table-billing-shipping-address[data-layout-type-modern] .yaymail-billing-address-wrap,
    .yaymail-element-${element.id} .yaymail-table-billing-shipping-address[data-layout-type-modern] .yaymail-shipping-address-wrap {
      border: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .yaymail-element-${element.id} .yaymail-shipping-address-wrap address {
      font-weight: ${shippingContentTextFormat.bold ? 'bold' : 'normal'} !important;
      font-style: ${shippingContentTextFormat.italic ? 'italic' : 'normal'} !important;
      text-decoration: ${shippingContentTextFormat.underline ? 'underline' : 'none'} !important;
      text-align: ${shippingContentAlignment} !important;
    }

    .yaymail-element-${element.id} .yaymail-billing-address-wrap address {
      font-weight: ${billingContentTextFormat.bold ? 'bold' : 'normal'} !important;
      font-style: ${billingContentTextFormat.italic ? 'italic' : 'normal'} !important;
      text-decoration: ${billingContentTextFormat.underline ? 'underline' : 'none'} !important;
      text-align: ${billingContentAlignment} !important;
    }
  `,
    [
      element.id,
      billingContentTextFormat,
      shippingContentTextFormat,
      billingContentAlignment,
      shippingContentAlignment,
    ],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-billing-shipping-address"
      element={element}
      style={wrapperStyles}
    >
      <style>{elementSpecificStyles}</style>
      <table
        className="yaymail-table-billing-shipping-address"
        style={{ borderSpacing: '5px' }}
        {...tableData}
      >
        <tbody>
          <tr>
            <MemoizedAddressLayout
              element={element}
              titleValuePath="billing_title"
              title={shortcodedBillingTitle}
              content={shortcodedBillingContent}
              titleColor={data.title_color}
              textColor={data.text_color}
              borderColor={data.border_color}
              emptyContent={emptyBillingContent}
              isBilling={true}
              fontSize={Number(data.billing_content_font_size ?? 14)}
            />
            <MemoizedAddressLayout
              element={element}
              titleValuePath="shipping_title"
              title={shortcodedShippingTitle}
              content={shortcodedShippingContent}
              titleColor={data.title_color}
              textColor={data.text_color}
              borderColor={data.border_color}
              emptyContent={emptyShippingContent}
              isBilling={false}
              fontSize={Number(data.shipping_content_font_size ?? 14)}
            />
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const BillingShippingAddress = withMemo(BillingShippingAddressContent);

const AddressLayout = (props: {
  element: IElement;
  titleValuePath: string;
  title: string;
  content: string;
  textColor?: string;
  titleColor?: string;
  borderColor?: string;
  emptyContent?: string;
  isBilling?: boolean;
  fontSize?: number;
}) => {
  const titleStyles: CSSProperties = useMemo(
    () => ({
      color: props.titleColor ?? YAYMAIL_TOKENS.color.black[700],
      padding: getDimensionValue(0),
      margin: '0 0 7px 0',
    }),
    [props.titleColor],
  );

  const contentWrapperStyle: CSSProperties = useMemo(
    () => ({
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: props.borderColor ?? '#e5e5e5',
      color: props.textColor ?? YAYMAIL_TOKENS.color.black[700],
      padding: getDimensionValue(12),
      fontSize: getDimensionValue(props.fontSize ?? 14),
    }),
    [props.borderColor, props.textColor, props.fontSize],
  );

  return (
    <td
      style={{ width: '50%', verticalAlign: 'top' }}
      className={`yaymail-${props.isBilling ? 'billing' : 'shipping'}-address-column`}
    >
      <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderSpacing: 0 }}>
        <tbody>
          <tr>
            <td>
              <EditZone
                element={props.element}
                valuePath={props.titleValuePath}
                displayHtml={props.title ?? 'Address'}
                className={
                  props.isBilling ? 'yaymail-billing-title' : 'yaymail-shipping-title'
                }
                style={titleStyles}
                attributeLabel={props.isBilling ? 'Billing title' : 'Shipping title'}
              />
            </td>
          </tr>
          <tr>
            <td>
              <table cellPadding="0" cellSpacing="0" width="100%" style={{ borderSpacing: 0 }}>
                <tbody>
                  <tr>
                    <td
                      className={`${
                        props.isBilling
                          ? 'yaymail-billing-address-wrap'
                          : 'yaymail-shipping-address-wrap'
                      }`}
                      style={contentWrapperStyle}
                    >
                      {props.content ? (
                        <div dangerouslySetInnerHTML={{ __html: props.content }} />
                      ) : (
                        <div>
                          <address>{props.emptyContent ?? 'No Address set.'}</address>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </td>
  );
};

const MemoizedAddressLayout = memo(AddressLayout);

export default BillingShippingAddress;
