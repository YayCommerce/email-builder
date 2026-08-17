import { IElement } from '@src/features/email-customizer/type';

/** Types that participate in Map Your Content (sidebar, slots, preview). */
export const MAPPING_DETECT_ELEMENT_TYPES = [
  'logo',
  'heading',
  'footer',
  'social_icon',
  'order_details',
] as const;

export type DetectableElementType = (typeof MAPPING_DETECT_ELEMENT_TYPES)[number];

const DETECTABLE_TYPES = new Set<string>(MAPPING_DETECT_ELEMENT_TYPES);

const MAPPING_CONTENT_FIELDS: Record<DetectableElementType, readonly string[]> = {
  logo: ['src', 'alt', 'url'],
  heading: ['rich_text'],
  footer: ['rich_text'],
  social_icon: ['icon_list'],
  order_details: [
    'title',
    'rich_text',
    'payment_instructions',
    'product_title',
    'cost_title',
    'quantity_title',
    'price_title',
    'cart_subtotal_title',
    'payment_method_title',
    'order_total_title',
    'order_note_title',
    'shipping_title',
    'discount_title',
  ],
};

const asData = (element: IElement): Record<string, unknown> =>
  element.data as Record<string, unknown>;

function contentKeysFor(type: string): readonly string[] {
  if (!DETECTABLE_TYPES.has(type)) {
    return [];
  }
  return MAPPING_CONTENT_FIELDS[type as DetectableElementType];
}

export function isDetectableMappingElement(element: IElement): boolean {
  return DETECTABLE_TYPES.has(element.type);
}

function normalizeFieldValue(value: unknown): string {
  if (typeof value !== 'string') {
    return JSON.stringify(value);
  }
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isContentEqual(a: IElement, b: IElement): boolean {
  if (a.type !== b.type) {
    return false;
  }

  const keys = contentKeysFor(a.type);
  if (keys.length === 0) {
    return false;
  }

  const aData = asData(a);
  const bData = asData(b);
  return keys.every((key) => normalizeFieldValue(aData[key]) === normalizeFieldValue(bData[key]));
}

export function mergeOldContentFieldsIntoNewElement(
  newEl: IElement,
  chosenOld: IElement,
): IElement {
  if (newEl.type !== chosenOld.type) {
    return newEl;
  }

  const keys = contentKeysFor(newEl.type);
  if (keys.length === 0) {
    return chosenOld;
  }

  const newData = { ...asData(newEl) };
  const oldData = asData(chosenOld);

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(oldData, key)) {
      newData[key] = oldData[key];
    }
  }

  return { ...newEl, data: newData } as IElement;
}
