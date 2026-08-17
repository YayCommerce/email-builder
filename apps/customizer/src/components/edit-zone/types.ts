import { CSSProperties } from 'react';

import { IElement } from '@src/features/email-customizer/type';

export type CanvasContentType = 'html' | 'plain_text';

export type ActiveEditZone = {
  elementId: string | number;
  valuePath: string;
};

export type EditZoneProps = {
  /** Element instance — EditZone derives id and edit value from it */
  element: IElement;
  /** Path in element.data */
  valuePath: string;
  /** Shortcode-resolved HTML for view mode */
  displayHtml: string;
  /** Label for undo/history */
  attributeLabel?: string;
  /** How content is saved — default html */
  contentType?: CanvasContentType;
  className?: string;
  style?: CSSProperties;
  /** Force view-only (e.g. global header override) */
  disabled?: boolean;
};
