import { CanvasContentType } from './types';

/** Normalize browser contentEditable HTML toward TinyMCE-compatible tags. */
export function normalizeHtml(html: string): string {
  return html
    .replace(/<\/?b>/gi, (m) => (m.startsWith('</') ? '</strong>' : '<strong>'))
    .replace(/<\/?i>/gi, (m) => (m.startsWith('</') ? '</em>' : '<em>'))
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

/** Strip all HTML tags — for plain_text content type. */
export function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return (doc.body.textContent ?? '').trim();
}

export function prepareContentForSave(html: string, contentType: CanvasContentType): string {
  if (contentType === 'plain_text') {
    return stripHtml(html);
  }
  return normalizeHtml(html);
}

/** Place caret at click coordinates inside a contentEditable element. */
export function placeCaretAtPoint(x: number, y: number): void {
  const doc = document as Document & {
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };

  let range: Range | null = null;

  if (typeof doc.caretRangeFromPoint === 'function') {
    range = doc.caretRangeFromPoint(x, y);
  } else if (typeof doc.caretPositionFromPoint === 'function') {
    const pos = doc.caretPositionFromPoint(x, y);
    if (pos) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }

  if (!range) return;

  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}
