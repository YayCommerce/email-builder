/* eslint-disable no-restricted-imports */
import { ElementType, IElement } from '@src/features/email-customizer';
import { ITemplate } from '@src/features/email-templates';

export type UpdateTemplatePayloadType = {
  template_id: string;
  template_elements: IElement<ElementType>[];
  background_color: string;
  text_link_color: string;
  content_background_color: string;
  content_text_color: string;
  title_color: string;
  preheader?: string;
  email_subject?: string;
  global_header_settings?: ITemplate['global_header_settings'];
  global_footer_settings?: ITemplate['global_footer_settings'];
};

export type ResponseType<T = any> = T & {
  isError?: boolean;
  success?: boolean;
  message?: string;
};

export type RevisionType = RevisionItemDataType & {
  revision_id: string;
  modified_at: string;
  modified_by: string;
};
export type RevisionListType = RevisionType[];

export type RevisionItemDataType = Partial<UpdateTemplatePayloadType>;

export type PagingListRequestType<T = { [key: string]: any }> = {
  search_string?: string;
  page_num: number;
  page_size?: number;
} & T;

export type EntityType = 'categories' | 'tags' | 'products';
/**
 * Entity could be Product/ Category/ Tag
 */
export type Entity = {
  id: string;
  name: string;
};

/**
 * Paging list of Entity (Products/ Categories/ Tags)
 */
export type EntityPage = { list: Array<Entity>; next_page: number | false };

export type MigrationOnloadData = {
  required_migrations: string[];
  backups: Array<{
    name: string;
    created_date: string;
  }>;
  is_critical_migration_required: boolean;
};
