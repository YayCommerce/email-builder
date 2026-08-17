import { IElement } from '@src/features/email-customizer';

import restApi from './api';
import { ResponseType } from './types';

export type TemplateLibrarySource = 'builtin' | 'saved';

export type TemplateLibrarySummary = {
  id: string;
  email_type: string;
  name: string;
  elements: IElement[];
  email_settings?: {
    background_color?: string;
    content_background_color?: string;
    content_text_color?: string;
    title_color?: string;
    text_link_color?: string;
  };
  description?: string;
  thumbnail?: string;
  position?: number;
  available?: boolean;
  access?: 'free' | 'pro' | 'coming_soon';
  source?: TemplateLibrarySource;
};

export type SaveAsTemplateScope = 'current' | 'all';

export type SaveAsTemplateEmailSettings = {
  background_color?: string;
  content_background_color?: string;
  content_text_color?: string;
  title_color?: string;
  text_link_color?: string;
};

export type SaveAsTemplatePayload = {
  scope: SaveAsTemplateScope;
  name: string;
  email_type: string;
  elements: IElement[];
  email_settings?: SaveAsTemplateEmailSettings;
  global_header_settings?: Record<string, unknown>;
  global_footer_settings?: Record<string, unknown>;
};

export const SAVED_TEMPLATE_ID_PREFIX = 'saved_';

export const parseSavedTemplatePublicId = (id: string): string | null => {
  if (!id.startsWith(SAVED_TEMPLATE_ID_PREFIX)) {
    return null;
  }
  const publicId = id.slice(SAVED_TEMPLATE_ID_PREFIX.length);
  return publicId.length > 0 ? publicId : null;
};

export const getTemplateLibraryQueryKey = (email_type: string) =>
  ['template-library', email_type] as const;

export async function getTemplateLibraryList(params: { email_type: string }) {
  const response = await restApi.get<ResponseType<{ templates: TemplateLibrarySummary[] }>>(
    '/template-library',
    { params },
  );
  return response;
}

export async function saveAsTemplateLibrary(payload: SaveAsTemplatePayload) {
  const response = await restApi.post<ResponseType>(`/template-library/saved`, payload);
  return response;
}

export async function deleteSavedTemplateLibrary(publicId: string) {
  const response = await restApi.delete<ResponseType>(`/template-library/saved/${publicId}`);
  return response;
}
