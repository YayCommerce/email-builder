import { IElement } from '@src/features/email-customizer/type';

export function getContentPreviewText(element: IElement): string {
  const { type, data, name } = element;
  const d = data as any;

  switch (type) {
    case 'logo':
    case 'image':
      if (d.src) {
        const parts = d.src.split('/');
        return parts[parts.length - 1] || d.src;
      }
      return 'No image';

    case 'text':
    case 'heading':
    case 'title':
      if (d.rich_text) {
        const text = d.rich_text.replace(/<[^>]*>/g, '').trim();
        return text.length > 60 ? text.substring(0, 60) + '...' : text;
      }
      return 'Empty text';

    case 'button':
      return d.text || 'Button';

    case 'column_layout':
      return `Column Layout (${d.amount_of_columns || 1} columns)`;

    case 'order_details':
    case 'billing_address':
    case 'shipping_address':
    case 'billing_shipping_address':
    case 'order_details_download':
    case 'hook':
    case 'shipping_tax_shipment_tracking':
      return `${name || type} Block`;

    default:
      return name || type;
  }
}

