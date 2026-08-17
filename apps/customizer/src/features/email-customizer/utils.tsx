import { ITemplate } from '@src/features/email-templates/types';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';
import { isDefined } from '@yaymail/utilities/src/functions';
import { SortableEvent } from 'sortablejs';
import { v4 as uuid, validate } from 'uuid';

import {
  CONTAINER_CLASS_NAME,
  NESTED_COLUMN_CLASS_NAME,
  SIDEBAR_ELEMENT_CONTAINER_CLASS_NAME,
} from './constants';
import { ElementType, IElement, IShortcode, IShortcodeGroups, PatternType } from './type';

export const findObjectById = (id: IElement['id'], arr: IElement[]): IElement | null => {
  for (const obj of arr) {
    if (obj.id === id) {
      return obj;
    }
    if (obj.children && obj.children.length > 0) {
      const result = findObjectById(id, obj.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const findObjectByChildrenId = (id: IElement['id'], arr: IElement[]): IElement | null => {
  for (const obj of arr) {
    if (obj.id === id) {
      return obj;
    }
    if (obj.children && obj.children.length > 0) {
      const childWithId = obj.children.find((child) => child.id === id);
      if (childWithId) {
        return obj;
      }
      const result = findObjectByChildrenId(id, obj.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const replaceObjectById = (
  id: IElement['id'],
  list: IElement[],
  newObj: IElement,
): boolean => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      list[i] = newObj;
      return true;
    }
    if (list[i].children && list[i].children!.length > 0) {
      const result = replaceObjectById(id, list[i].children!, newObj);
      if (result) {
        return true;
      }
    }
  }
  return false;
};

export const deleteObjectByIds = (ids: IElement['id'][], list: IElement[]): IElement[] => {
  const workingList = structuredClone(list);
  return workingList
    .filter((element) => !ids.includes(element.id))
    .map((element) => ({
      ...element,
      ...(element.children ? { children: deleteObjectByIds(ids, element.children) } : {}),
    }));
};

export const duplicateObjectByIds = (ids: IElement['id'][], list: IElement[]): IElement[] => {
  const workingList = structuredClone(list);
  const insertElements: IElement<ElementType>[] = [];
  let lastPositionToInsert = 0;
  workingList.forEach((element, ind) => {
    if (ids.includes(element.id)) {
      insertElements.push(renewElementId(element));
      lastPositionToInsert = ind + 1;
    }
    if (element.children == null) {
      return;
    }
    workingList[ind].children = duplicateObjectByIds(ids, element.children);
  });
  workingList.splice(lastPositionToInsert, 0, ...insertElements);

  return workingList;
};

export const pasteObjectById = (
  id: IElement['id'],
  list: IElement[],
  copiedElement: IElement | null,
): boolean => {
  if (copiedElement == null) {
    return false;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      const newElement = renewElementId(copiedElement);
      list.splice(i + 1, 0, newElement);
      return true;
    }
    if (list[i].children && list[i].children!.length > 0) {
      const result = pasteObjectById(id, list[i].children!, copiedElement);
      if (result) {
        return true;
      }
    }
  }
  return false;
};

const moveElement = ({
  array,
  oldIndex,
  newIndex,
}: {
  array: IElement[];
  oldIndex: number;
  newIndex: number;
}): IElement[] => {
  if (oldIndex < 0 || oldIndex >= array.length || newIndex < 0 || newIndex >= array.length) {
    throw new Error('Invalid index');
  }

  if (oldIndex === newIndex) {
    return array; // No changes needed, return the original array
  }

  const newArray = [...array];
  const [element] = newArray.splice(oldIndex, 1);
  newArray.splice(newIndex, 0, element);

  return newArray;
};

export const sortElements = (e: SortableEvent, oldList: IElement[]): IElement[] | null => {
  if (e.from !== e.to) return null;

  if (e.newIndex === undefined) {
    console.debug('YayMail: Could not detect sortable new index');
    return null;
  }
  let cloneList = structuredClone<IElement[]>(oldList);
  cloneList = moveElement({
    array: cloneList,
    oldIndex: e.oldIndex ?? 0,
    newIndex: e.newIndex ?? 0,
  });

  return cloneList;
};

const reduceElementData = (element: any): any => {
  if (!element || !element.data) {
    return element;
  }

  const canCheckValuePath = Object.values(element.data).some(
    (attributeData: any) => attributeData.value_path != null,
  );
  if (element.type === 'column') {
    element.id = uuid();
  }
  // This is tricky to prevent custom property without value_path to be saved in the database
  const result = {
    ...element,
    data: Object.fromEntries(
      Object.entries(element.data)
        .filter(([_, attributeData]: [string, any]) =>
          !canCheckValuePath ? true : attributeData.value_path != null,
        )
        .map(([key, value]: [string, any]) => [key, value?.default_value ?? value]),
    ),
    children:
      isDefined(element.children) && element.children.length > 0
        ? element.children.map((child: any) => reduceElementData(child))
        : element.children,
  };

  return window.yaymailData.yaymailHooks.applyFilters(
    'yaymail_reduced_element_data_before_add',
    result,
  );
};

export const addElement = (
  e: SortableEvent,
  oldList: IElement[],
  parentId?: IElement['id'],
  columnIndex?: number,
): { addedList: IElement[] | null; addedElementName: string } | null => {
  if (!e.item.dataset.yaymailElementId) {
    console.debug('YayMail: Please provide Element data in data attribute');
    return null;
  }

  if (!isDefined(e.from.classList) || !isDefined(e.to.classList)) {
    console.debug('YayMail: Could not detect source/target');
    return null;
  }

  const type = e.item.dataset.yaymailElementType as IElement['type'];

  const isPattern = e.item.dataset.yaymailElementIsPattern === 'true';

  // User saved pattern does not need a type, so it is checked here.
  if (!type && !isPattern) {
    console.debug('YayMail: Please provide element data attribute: type');
    return null;
  }

  const id = e.item.dataset.yaymailElementId as IElement['id'];

  if (!id) {
    console.debug('YayMail: Please provide element data attribute: id');
    return null;
  }

  const element = useCustomizerPageStore.getState().elements.find((e) => e.type === type);

  if (!isPattern && (!element || !element.available)) {
    console.debug('YayMail: Invalid element type');
    return null;
  }

  const isAddToNested = e.to.classList.contains(NESTED_COLUMN_CLASS_NAME);
  const isAddToContainer = e.to.classList.contains(CONTAINER_CLASS_NAME);
  const isAddFromSidebar = e.from.classList.contains(SIDEBAR_ELEMENT_CONTAINER_CLASS_NAME);

  let cloneList = structuredClone<IElement[]>(oldList);

  // Start handling pattern
  if (isPattern) {
    let addingPattern: PatternType | undefined = window.yaymailData.builder.patterns.find(
      (item) => item.type === type,
    );

    let addedElementName = addingPattern?.name;

    if (null == addingPattern) {
      console.debug('YayMail: Cannot find pattern from window variable!');
      return null;
    }
    const elements = addingPattern.elements;

    // Do nothing if target element is column and pattern also contains column
    if (isAddToNested && elements.some((element: IElement) => element.type === 'column_layout'))
      return null;

    let elementsWithNewIds: IElement<ElementType>[] = elements.map((element) =>
      renewElementId(reduceElementData(element)),
    );

    cloneList.splice(e.newIndex ?? cloneList.length, 0, ...elementsWithNewIds);
    return {
      addedList: cloneList,
      addedElementName: addedElementName ?? '',
    };
  }
  // End pattern logic

  let newElementData: any = null;

  if (isAddFromSidebar) {
    newElementData = useCustomizerPageStore.getState().elements.find((e) => e.id === id) ?? null;
  } else {
    newElementData = findObjectById(id, oldList);
  }

  if (!newElementData) {
    console.debug('YayMail: Failed to get element data');
    return null;
  }

  delete newElementData.parentId; // Remove parentId when sortable

  cloneList = deleteObjectByIds([newElementData.id], cloneList);

  const newId = validate(newElementData.id as string) ? newElementData.id : uuid();

  // TODO Optimize this block of code
  // =========
  // Get rid of the attribute editor data
  newElementData = reduceElementData(newElementData);
  // ===========

  if (isAddToNested) {
    if (type === 'column_layout') {
      return null;
    }

    if (!isDefined(parentId) || !isDefined(columnIndex)) {
      console.debug('YayMail: Undefined parentId or columnIndex');
      return null;
    }

    const columnLayoutElement = findObjectById(parentId, cloneList);

    if (!columnLayoutElement || !columnLayoutElement.children) return null;

    newElementData = {
      ...newElementData,
      id: newId,
      parentId: columnLayoutElement.children[columnIndex].id,
    };

    if (null == columnLayoutElement.children[columnIndex].children) {
      columnLayoutElement.children[columnIndex].children = [];
    }

    const cloneChildren = structuredClone(columnLayoutElement.children[columnIndex].children);
    /** Add new element to specific index */
    cloneChildren?.splice(e.newIndex ?? cloneChildren.length, 0, newElementData);

    columnLayoutElement.children[columnIndex].children = cloneChildren;
  } else if (isAddToContainer) {
    if (!isDefined(parentId)) {
      console.debug('YayMail: Undefined parentId for container');
      return null;
    }

    const containerElement = findObjectById(parentId, cloneList);
    if (!containerElement) return null;

    newElementData = {
      ...newElementData,
      id: newId,
      parentId: containerElement.id,
    };

    if (null == containerElement.children) {
      containerElement.children = [];
    }

    const cloneChildren = structuredClone(containerElement.children);
    /** Add new element to specific index */
    cloneChildren?.splice(e.newIndex ?? cloneChildren.length, 0, newElementData);

    containerElement.children = cloneChildren;
  } else {
    newElementData = {
      ...newElementData,
      id: newId,
    };

    /** Add new element to selected index */
    cloneList.splice(e.newIndex ?? cloneList.length, 0, newElementData);
  }
  return { addedList: cloneList, addedElementName: newElementData.name ?? '' };
};

export const getStylesData = (elementType: string, data: IElement['data']) => {
  if (elementType === 'image_box' || elementType === 'image_list' || elementType === 'text_list') {
    const copiedAttributes = Object.entries(data).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (value && typeof value === 'object' && 'type' in value && value.type === 'style') {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );
    return copiedAttributes;
  }
  const elementAttributes = useCustomizerPageStore
    .getState()
    .elements.find((e) => e.type === elementType)?.data;

  const copiedAttributes = Object.entries(elementAttributes || {}).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (
        value &&
        typeof value === 'object' &&
        'type' in value &&
        value.type === 'style' &&
        key in data
      ) {
        acc[key] = (data as Record<string, unknown>)[key];
      }
      return acc;
    },
    {},
  );

  return copiedAttributes;
};

/**
 * @deprecated
 * Use import {getDimensionValue} from '@yaymail/utilities/src/functions'
 */
export const getDimensionValue = (value: string | number, unit: 'px' | '%' | 'rem' = 'px') => {
  return `${value}${unit}`;
};

/**
 * @deprecated
 */
export const getElementPropertyValue = (property: any, sub_property?: string) => {
  if (property === undefined || property.default_value === undefined) return '';
  if (sub_property !== undefined) {
    return property.default_value[sub_property];
  }
  return property.default_value;
};

export const groupShortcodes = (shortcodes: IShortcode[]): IShortcodeGroups => {
  return shortcodes.reduce<IShortcodeGroups>((result, shortcode) => {
    const shortcodeShortData = {
      name: shortcode.name,
      description: shortcode.description,
      attributes: shortcode.attributes,
    };
    if (shortcode.group in result) {
      result[shortcode.group].shortcodes.push(shortcodeShortData);
    } else {
      if (shortcode.group !== '') {
        result[shortcode.group] = {
          groupLabel: shortcode.group.replaceAll('_', ' '),
          shortcodes: [shortcodeShortData],
        };
      }
    }
    return result;
  }, {});
};

/**
 * @deprecated
 * Use import {replacePlaceholders} from '@yaymail/utilities/src/functions'
 *
 * Replaces placeholders in an HTML string with values from a replacements object.
 *
 * @param {string} html - The HTML string containing placeholders in the form of {{key}} or [[key]].
 * @param {Record<string, string>} replacements - An object with key-value pairs for replacement.
 * @returns {string} - The HTML string with placeholders replaced by corresponding values.
 */

export const replacePlaceholders = (
  html: string,
  replacements: Record<string, string> | { [x: string]: string },
) => {
  const combinedRegex = /{{(.*?)}}|\[\[(.*?)\]\]/g;

  const replacedHtml = html.replace(combinedRegex, (match, p1, p2) => {
    const key = p1 || p2;
    const trimmedKey = key.trim();
    if (Object.prototype.hasOwnProperty.call(replacements, trimmedKey)) {
      if (trimmedKey === 'show_product_item_cost') {
        let replacementValue: any = replacements[trimmedKey];
        if (replacementValue === 'true') {
          replacementValue = true;
        } else if (replacementValue === 'false') {
          replacementValue = false;
        }
        const isShowProductItemCost = Boolean(replacementValue);
        return isShowProductItemCost ? '3' : '2';
      }
      return replacements[trimmedKey];
    } else {
      return match;
    }
  });

  return replacedHtml;
};

export const isShowPaymentInstructions = (
  paymentDisplayMode: string | unknown,
  emailId: string | null,
  templateList: ITemplate[],
) => {
  if (emailId === null) return false;
  // TODO: this function should be removed later

  const allEmailsIds = templateList.map((template) => template.name);

  const customerEmailsIds = templateList
    .filter((email) => email.recipient === __('Customer', 'yaymail'))
    .map((email) => email.name);

  switch (paymentDisplayMode) {
    case 'no':
      return false;
    case 'yes':
      return allEmailsIds.includes(emailId);
    case 'customer':
      return customerEmailsIds.includes(emailId);
    default:
      return false;
  }
};

export const removeIconFromElements = (list: IElement[] | null): IElement[] => {
  if (!list) return [];

  return list.map((element) => ({
    ...element,
    icon: '',
    ...(element.children
      ? {
          children: removeIconFromElements(element.children),
        }
      : {}),
  }));
};

export const findParentColumnLayout = (parentId: IElement['id'], list: IElement[]) => {
  const parentColumn = findObjectById(parentId, list);
  if (parentColumn?.type === 'container') {
    return parentColumn;
  }
  if (!parentColumn) return null;
  const parentColumnLayout = findObjectByChildrenId(parentColumn.id, list);
  return parentColumnLayout;
};

/**
 * Renew id for element, this will renew children id also.
 * @version 4.0
 * @returns IElement<ElemenType> Element with new Id
 */
export const renewElementId = (element: IElement, parent?: IElement) => {
  const workingElement = structuredClone(element); // Make sure we do not change the root value
  workingElement.id = uuid();
  if (parent != null) {
    workingElement.parentId = parent.id;
  } else {
    workingElement.parentId = undefined;
  }
  if (workingElement.children == null || workingElement.children.length < 1) {
    return workingElement;
  }
  workingElement.children = workingElement.children.map((childElement) =>
    renewElementId(childElement, workingElement),
  );
  return workingElement;
};

/** Clone ids for preview DOM while keeping a map back to source template ids. */
export function renewElementIdWithDomToSourceIdMap(element: IElement): {
  element: IElement;
  domIdToSourceId: Map<string | number, string | number>;
} {
  const domIdToSourceId = new Map<string | number, string | number>();

  const walk = (node: IElement, parent?: IElement): IElement => {
    const sourceId = node.id;
    const workingElement = structuredClone(node);
    workingElement.id = uuid();
    domIdToSourceId.set(workingElement.id, sourceId);
    if (parent != null) {
      workingElement.parentId = parent.id;
    } else {
      workingElement.parentId = undefined;
    }
    if (workingElement.children?.length) {
      workingElement.children = workingElement.children.map((child) => walk(child, workingElement));
    }
    return workingElement;
  };

  return { element: walk(element), domIdToSourceId };
}

export const getDuplicatedObjectByIds = (ids: IElement['id'][], list: IElement[]): IElement[] => {
  const workingList = structuredClone(list);
  const insertElements: IElement<ElementType>[] = [];
  workingList.forEach((element, ind) => {
    if (ids.includes(element.id)) {
      insertElements.push(renewElementId(element));
    }
    if (element.children == null) {
      return;
    }
    workingList[ind].children = duplicateObjectByIds(ids, element.children);
  });

  return insertElements;
};

export const findAndReplaceElement = (
  elements: IElement[],
  targetId: string | number,
  newElement: IElement,
): boolean => {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === targetId) {
      elements.splice(i, 1, newElement);
      return true;
    }

    if (elements[i].children && Array.isArray(elements[i].children)) {
      if (findAndReplaceElement(elements[i].children!, targetId, newElement)) {
        return true;
      }
    }
  }
  return false;
};

export const detectOS = () => {
  const userAgent = window.navigator.userAgent;
  let os = 'window';
  if (userAgent.indexOf('Mac') != -1) os = 'mac';
  return os;
};