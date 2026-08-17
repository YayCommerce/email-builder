import { Fragment, RefObject, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { IElement } from '@src/features/email-customizer/type';

import EditZone from './index';
import useEditZoneStore from './store';
import { CanvasContentType } from './types';

export type TableLabelZoneConfig = {
  selector: string;
  valuePath: string;
  attributeLabel?: string;
  contentType?: CanvasContentType;
};

/** Default zones for YayMail order-details-style tables (core + similar addons). */
export const ORDER_DETAILS_LABEL_ZONES: TableLabelZoneConfig[] = [
  {
    selector: '.yaymail_item_product_title',
    valuePath: 'product_title',
    attributeLabel: 'Product title',
  },
  {
    selector: '.yaymail_item_cost_title',
    valuePath: 'cost_title',
    attributeLabel: 'Cost title',
  },
  {
    selector: '.yaymail_item_quantity_title',
    valuePath: 'quantity_title',
    attributeLabel: 'Quantity title',
  },
  {
    selector: '.yaymail_item_price_title',
    valuePath: 'price_title',
    attributeLabel: 'Price title',
  },
  {
    selector: '.yaymail-order-detail-row-cart_subtotal > th',
    valuePath: 'cart_subtotal_title',
    attributeLabel: 'Cart subtotal title',
  },
  {
    selector: '.yaymail-order-detail-row-discount > th',
    valuePath: 'discount_title',
    attributeLabel: 'Discount title',
  },
  {
    selector: '.yaymail-order-detail-row-shipping > th',
    valuePath: 'shipping_title',
    attributeLabel: 'Shipping title',
  },
  {
    selector: '.yaymail-order-detail-row-payment_method > th',
    valuePath: 'payment_method_title',
    attributeLabel: 'Payment method title',
  },
  {
    selector: '.yaymail-order-detail-row-order_total > th',
    valuePath: 'order_total_title',
    attributeLabel: 'Order total title',
  },
  {
    selector: '.yaymail-order-detail-row-order_note > th',
    valuePath: 'order_note_title',
    attributeLabel: 'Order note title',
  },
];

type Host = TableLabelZoneConfig & { host: HTMLElement };

export type TableLabelEditPortalsProps = {
  tableRef: RefObject<HTMLTableElement | null>;
  element: IElement;
  /** Re-scan cells when table HTML is regenerated */
  html: string;
  displayByPath: Record<string, string>;
  /**
   * Label cell mappings. Defaults to ORDER_DETAILS_LABEL_ZONES for tables that
   * reuse YayMail order-details markup/classes.
   */
  zones?: TableLabelZoneConfig[];
  hostClassName?: string;
  editClassName?: string;
};

/**
 * After a table is rendered from an HTML string, mount EditZones into known
 * label cells via portals so they can be edited on the canvas.
 */
const TableLabelEditPortals = ({
  tableRef,
  element,
  html,
  displayByPath,
  zones = ORDER_DETAILS_LABEL_ZONES,
  hostClassName = 'yaymail-table-label-edit-host',
  editClassName = 'yaymail-table-label-edit',
}: TableLabelEditPortalsProps) => {
  const [hosts, setHosts] = useState<Host[]>([]);
  const activeZone = useEditZoneStore((state) => state.activeZone);

  const labelValuePaths = useMemo(() => new Set(zones.map((zone) => zone.valuePath)), [zones]);

  const isEditingLabel =
    activeZone?.elementId === element.id && labelValuePaths.has(activeZone.valuePath);

  useLayoutEffect(() => {
    // Keep live contentEditable hosts while editing a label.
    if (isEditingLabel) {
      return;
    }

    const table = tableRef.current;
    if (!table) {
      setHosts([]);
      return;
    }

    const next: Host[] = [];

    for (const zone of zones) {
      const cell = table.querySelector(zone.selector) as HTMLElement | null;
      if (!cell) {
        continue;
      }

      cell.innerHTML = '';
      const mount = document.createElement('div');
      mount.className = hostClassName;
      cell.appendChild(mount);
      next.push({ ...zone, host: mount });
    }

    setHosts(next);
  }, [html, isEditingLabel, tableRef, zones, hostClassName]);

  return (
    <>
      {hosts.map((host) => (
        <Fragment key={host.valuePath}>
          {createPortal(
            <EditZone
              element={element}
              valuePath={host.valuePath}
              displayHtml={displayByPath[host.valuePath] ?? ''}
              contentType={host.contentType ?? 'plain_text'}
              attributeLabel={host.attributeLabel ?? host.valuePath}
              className={editClassName}
            />,
            host.host,
          )}
        </Fragment>
      ))}
    </>
  );
};

export default TableLabelEditPortals;
