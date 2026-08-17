import { CSSProperties, useEffect, useMemo, useRef } from 'react';

import EditZone from '@src/components/edit-zone';
import TableLabelEditPortals from '@src/components/edit-zone/TableLabelEditPortals';
import { useDirection } from '@src/hooks/useDirection';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { getDimensionValue, replacePlaceholders } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const OrderDetailsContent = ({ element }: ITemplateProps<'order_details'>) => {
  const data = element.data;
  const tableRef = useRef<HTMLTableElement>(null);

  const settings = useCustomizerSettingsStore((state) => state.settings);
  const direction = useDirection();
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
    [data.padding, data.background_color, data.font_family],
  );

  const tableStyles: CSSProperties = useMemo(
    () => ({
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
      border: `1px solid ${data.border_color ?? '#e5e5e5'}`,
      width: '100%',
    }),
    [data.text_color, data.border_color, getDimensionValue],
  );

  const titleStyles: CSSProperties = useMemo(
    () => ({
      color: data.title_color ?? YAYMAIL_TOKENS.color.black[700],
      marginTop: getDimensionValue(0),
      fontFamily: data.font_family ?? 'initial',
      marginBottom: getDimensionValue(7),
    }),
    [data.title_color, data.font_family, getDimensionValue],
  );

  const shortcodedTitle = useMemo(() => doShortcode(data.title ?? ''), [data.title, doShortcode]);

  const shortcodedContent = useMemo(
    () => doShortcode(data.rich_text ?? ''),
    [data.rich_text, doShortcode],
  );

  // const tableTitle = useMemo(() => element.data.table_titles ?? {}, [element.data.table_titles]);

  const productTitle = useMemo(
    () => doShortcode(data.product_title ?? ''),
    [data.product_title, doShortcode],
  );

  const costTitle = useMemo(
    () => doShortcode(data.cost_title ?? ''),
    [data.cost_title, doShortcode],
  );

  const priceTitle = useMemo(
    () => doShortcode(data.price_title ?? ''),
    [data.price_title, doShortcode],
  );

  const quantityTitle = useMemo(
    () => doShortcode(data.quantity_title ?? ''),
    [data.quantity_title, doShortcode],
  );

  const cartSubtotalTitle = useMemo(
    () => doShortcode(data.cart_subtotal_title ?? ''),
    [data.cart_subtotal_title, doShortcode],
  );

  const discountTitle = useMemo(
    () => doShortcode(data.discount_title ?? ''),
    [data.discount_title, doShortcode],
  );

  const paymentMethodTitle = useMemo(
    () => doShortcode(data.payment_method_title ?? ''),
    [data.payment_method_title, doShortcode],
  );

  const orderTotalTitle = useMemo(
    () => doShortcode(data.order_total_title ?? ''),
    [data.order_total_title, doShortcode],
  );

  const orderNoteTitle = useMemo(
    () => doShortcode(data.order_note_title ?? ''),
    [data.order_note_title, doShortcode],
  );

  const shippingTitle = useMemo(
    () => doShortcode(data.shipping_title ?? ''),
    [data.shipping_title, doShortcode],
  );

  const tableTitle = useMemo(
    () => ({
      product_title: productTitle,
      cost_title: costTitle,
      price_title: priceTitle,
      quantity_title: quantityTitle,
      cart_subtotal_title: cartSubtotalTitle,
      discount_title: discountTitle,
      payment_method_title: paymentMethodTitle,
      order_total_title: orderTotalTitle,
      order_note_title: orderNoteTitle,
      shipping_title: shippingTitle,
    }),
    [
      productTitle,
      costTitle,
      priceTitle,
      quantityTitle,
      cartSubtotalTitle,
      discountTitle,
      paymentMethodTitle,
      orderTotalTitle,
      orderNoteTitle,
      shippingTitle,
    ],
  );

  const html = useMemo(() => {
    let baseContent = shortcodedContent;
    if (direction === 'rtl') {
      baseContent = baseContent.replaceAll(/text-align:left/g, 'text-align:right');
    }
    if (direction === 'ltr') {
      baseContent = baseContent.replaceAll(/text-align:right/g, 'text-align:left');
    }
    return replacePlaceholders(baseContent, {
      ...(tableTitle as any),
      ...(settings as any),
    });
  }, [shortcodedContent, tableTitle, settings, direction]);

  // Get enabled custom footer rows
  const customFooterRows = useMemo(() => {
    return ((data as any).custom_footer_rows ?? []).filter((row: any) => row.enabled);
  }, [(data as any).custom_footer_rows]);

  // Inject custom rows into table footer
  useEffect(() => {
    if (!tableRef.current || customFooterRows.length === 0) {
      return;
    }

    const tfoot = tableRef.current.querySelector('tfoot.yaymail_element_foot_order_details');
    if (!tfoot) {
      return;
    }

    // Group rows by zone
    const rowsByZone: Record<string, any[]> = {
      before_all: [],
      after_subtotal: [],
      before_total: [],
      after_total: [],
    };

    customFooterRows.forEach((row: any) => {
      if (row.zone && rowsByZone[row.zone]) {
        rowsByZone[row.zone].push(row);
      }
    });

    // Sort rows within each zone by order
    Object.keys(rowsByZone).forEach((zone) => {
      rowsByZone[zone].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    // Get colspan values from first row
    const firstRow = tfoot.querySelector('tr');
    const labelColspan = firstRow?.querySelector('th')?.getAttribute('colspan') || '2';
    const valueColspan = firstRow?.querySelector('td')?.getAttribute('colspan') || '1';

    // Helper function to create custom row
    const createCustomRow = (customRow: any) => {
      const tr = document.createElement('tr');
      tr.className = `yaymail-order-detail-row-custom custom-row-${customRow.id}`;

      const label = doShortcode(customRow.label || '');
      const value = doShortcode(customRow.value || '');

      if (!label && !value) {
        return null;
      }

      // Apply same styles as other footer rows
      const cellStyle = `
        padding: 12px;
        text-align: ${direction === 'rtl' ? 'right' : 'left'};
        font-family: ${data.font_family ?? 'inherit'};
        color: ${data.text_color ?? YAYMAIL_TOKENS.color.black[700]};
        border-width: 1px;
        border-style: solid;
        border-color: ${data.border_color ?? '#e5e5e5'};
        border-top-width: 0;
      `;

      const headingStyle = cellStyle + `font-size: ${data.table_heading_font_size ?? 14}px;`;
      const contentStyle = cellStyle + `font-size: ${data.table_content_font_size ?? 14}px;`;

      tr.innerHTML = `
        <th class="td" scope="row" colspan="${labelColspan}" style="${headingStyle}">
          ${label}
        </th>
        <td class="td" colspan="${valueColspan}" style="${contentStyle}">
          ${value}
        </td>
      `;

      return tr;
    };

    // Find key rows for insertion points
    const subtotalRow = tfoot.querySelector('.yaymail-order-detail-row-cart_subtotal');
    const totalRow = tfoot.querySelector('.yaymail-order-detail-row-order_total');

    // Zone 1: Before all (insert at the beginning)
    rowsByZone.before_all.reverse().forEach((row) => {
      const customRowElement = createCustomRow(row);
      if (customRowElement && tfoot.firstElementChild) {
        tfoot.insertBefore(customRowElement, tfoot.firstElementChild);
      }
    });

    // Zone 2: After subtotal
    if (subtotalRow) {
      let insertAfter = subtotalRow;
      rowsByZone.after_subtotal.forEach((row) => {
        const customRowElement = createCustomRow(row);
        if (customRowElement) {
          insertAfter.insertAdjacentElement('afterend', customRowElement);
          insertAfter = customRowElement;
        }
      });
    }
    // Zone 3: Before total
    if (totalRow) {
      // Reverse to maintain order when inserting before
      [...rowsByZone.before_total].forEach((row) => {
        const customRowElement = createCustomRow(row);
        if (customRowElement) {
          totalRow.insertAdjacentElement('beforebegin', customRowElement);
        }
      });
    }

    // Zone 4: After total
    rowsByZone.after_total.reverse().forEach((row) => {
      const customRowElement = createCustomRow(row);
      if (customRowElement) {
        if (totalRow) {
          totalRow.insertAdjacentElement('afterend', customRowElement);
        } else {
          tfoot.appendChild(customRowElement);
        }
      }
    });

    // Cleanup function to remove custom rows before next render
    return () => {
      tfoot.querySelectorAll('.yaymail-order-detail-row-custom').forEach((row) => row.remove());
    };
  }, [html, customFooterRows, data, direction, doShortcode]);

  const showProductImage = useMemo(
    () => settings?.show_product_image ?? false,
    [settings?.show_product_image],
  );

  const productImagePosition = useMemo(
    () => settings?.product_image_position ?? 'top',
    [settings?.product_image_position],
  );

  const showProductDescription = useMemo(
    () => settings?.show_product_description ?? false,
    [settings?.show_product_description],
  );

  const showProductSKU = useMemo(
    () => settings?.show_product_sku ?? false,
    [settings?.show_product_sku],
  );

  const showProductHyperLinks = useMemo(
    () => settings?.show_product_hyper_links ?? false,
    [settings?.show_product_hyper_links],
  );

  const showProductRegularPrice = useMemo(
    () => settings?.show_product_regular_price ?? false,
    [settings?.show_product_regular_price],
  );

  const showProductItemCost = useMemo(
    () => settings?.show_product_item_cost ?? false,
    [settings?.show_product_item_cost],
  );

  const isLayoutTypeModern = useMemo(() => data.layout_type === 'modern', [data.layout_type]);

  const showTableHeader = useMemo(() => data.show_table_header !== false, [data.show_table_header]);

  const tableData = useMemo(
    () => ({
      ...(showProductImage
        ? {
            'product-image-position':
              direction === 'rtl' && productImagePosition === 'left'
                ? 'right'
                : productImagePosition,
          }
        : {}),
      ...(showProductDescription ? { 'data-show-product-description': true } : {}),
      ...(showProductSKU ? { 'data-show-product-sku': true } : {}),
      ...(showProductHyperLinks ? { 'data-show-product-hyper-link': true } : {}),
      ...(showProductRegularPrice ? { 'data-show-product-regular-price': true } : {}),
      ...(showProductItemCost ? { 'data-show-product-item-cost': true } : {}),
      ...(isLayoutTypeModern ? { 'data-layout-type-modern': true } : {}),
      ...(showTableHeader
        ? { 'data-show-table-header': true }
        : { 'data-show-table-header': false }),
    }),
    [
      showProductImage,
      productImagePosition,
      showProductDescription,
      showProductSKU,
      showProductHyperLinks,
      showProductRegularPrice,
      showProductItemCost,
      isLayoutTypeModern,
      showTableHeader,
      direction,
    ],
  );

  const elementSpecificStyles = useMemo(
    () => `
    .yaymail-element-${element.id} .yaymail-order-details-table[data-layout-type-modern]{
      border: 0 !important;
    }

    .yaymail-element-${element.id} .yaymail-order-details-table[data-layout-type-modern] th,
    .yaymail-element-${element.id} .yaymail-order-details-table[data-layout-type-modern] td {
      border: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    
    }

    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_item_price_title,
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_item_price_content,
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_element_foot_order_details tr td {
      text-align: right !important;
    }

    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_item_quantity_title,
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_item_quantity_content,
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_item_cost_title,
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail_item_cost_content {
      text-align: center !important;
    }

    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail-quantity-type-modern {
      display: inline-block;
    }
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-show-table-header='false']  .yaymail_element_head_order_details {
      display: none !important;
    }

    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .order_item:last-child td {
      border-bottom: 1px solid ${data.border_color ?? '#e5e5e5'} !important;
    }

    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail-order-detail-row-payment_method td,
    .yaymail-element-${
      element.id
    } .yaymail-order-details-table[data-layout-type-modern] .yaymail-order-detail-row-payment_method th {
        border-bottom: 1px solid ${data.border_color ?? '#e5e5e5'} !important;
    }
    
    .yaymail-element-${element.id} .yaymail-order-details-table td {
      font-size: ${data.table_content_font_size ?? 14}px !important;
    }

    .yaymail-element-${element.id} .yaymail-order-details-table th {
      font-size: ${data.table_heading_font_size ?? 14}px !important;
    }
  `,
    [element.id, data.table_content_font_size, data.table_heading_font_size, data.border_color],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-order-details"
      element={element}
      style={wrapperStyles}
    >
      <style>{elementSpecificStyles}</style>
      <EditZone
        element={element}
        valuePath="title"
        displayHtml={shortcodedTitle}
        className="yaymail-order-details-title"
        style={titleStyles}
      />
      <table
        ref={tableRef}
        className="yaymail-order-details-table"
        {...tableData}
        cellSpacing="0"
        cellPadding="6"
        style={tableStyles}
        border={1}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <TableLabelEditPortals
        tableRef={tableRef}
        element={element}
        html={html}
        displayByPath={tableTitle}
      />
    </ElementWrapper>
  );
};

const OrderDetails = withMemo(OrderDetailsContent);

export default OrderDetails;
