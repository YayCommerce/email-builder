import { isWpPlatform } from '@src/common/platform';
import { IElement } from '@src/features/email-customizer';

export function debug(...msgs: string[]) {
  console.debug('YayMail: ', ...msgs);
}

/**
 * @deprecated Use Javascript built-in function structuredClone() instead
 */
export function deepClone<T>(source: T): T {
  return JSON.parse(JSON.stringify(source));
}

/**
 * @deprecated
 * Use import {isDefined} from '@yaymail/utilities/src/functions'
 *
 * Checks if a value is defined and optionally checks for the existence of a property within an object.
 */
export function isDefined<T>(value: T | undefined | null, property?: string): value is T {
  if (value == null) return false;

  if (property != null && typeof value === 'object') {
    /** Check if property exists inside object */
    return Object.prototype.hasOwnProperty.call(value, property);
  }

  return true;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function calculateTimeDifference(current: Date, previous: Date): string {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current.getTime() - previous.getTime();

  if (Math.round(elapsed / 1000) == 0) {
    return 'Recently';
  }

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return Math.round(elapsed / msPerYear) + ' years ago';
  }
}

export function relativeTime(v: Date | string): string {
  const dateV = v instanceof Date ? v : new Date(v); // TODO: parse to current time zone
  return calculateTimeDifference(new Date(), dateV);
}

export function compareObjects(firstObj: Object, secondObj: Object) {
  return JSON.stringify(firstObj) === JSON.stringify(secondObj);
}

/**
 *
 * @Example: "HelloWorld" => "Hello World"
 */
export function pascalCaseToCapitalizedWords(input: string): string {
  // Use a regular expression to split the input string at uppercase letters
  const words = input.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return capitalizedWords;
}

export function underscoreToSpace(str: string) {
  return str.replace(/_/g, ' ');
}

export function roundUpToTwoDecimalNumbers(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

/**
 * Returns the default template name based on the active addon platform.
 * Email Builder (WP-only): wp-core-mail; YayMail (WC): new_order.
 */
export function getDefaultTemplateName(): string {
  if (isWpPlatform()) {
    return 'wp-core-mail';
  }
  return 'new_order';
}

/** Filter templates by the current page's addon platform (YayMail WC vs Email Builder WP). */
export function filterTemplatesByPlatform<T extends { name?: string }>(templates: T[]): T[] {
  if (isWpPlatform()) {
    return templates.filter((t) => t.name?.startsWith('wp-core-'));
  } else {
    return templates.filter((t) => !t.name?.startsWith('wp-core-'));
  }
}

export function mapColumnElements(elements: IElement[]): IElement[] {
  const mappedElements: IElement[] = [];
  elements.forEach((element) => {
    if (Array.isArray(element)) {
      element.forEach((subElement) => {
        mappedElements.push(subElement);
      });
    } else {
      mappedElements.push(element);
    }
  });

  return mappedElements;
}

/**
 * Converts a string to kebab case.
 *  @Example: "Hello World" => "hello_world"
 * @param str - The string to convert to kebab case.
 * @returns The string in kebab case.
 */
export function toKebabCase(str: string) {
  return str.toLowerCase().replace(/ /g, '-');
}

export function setCookie(cname: string, cvalue: string, exdays: number) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
