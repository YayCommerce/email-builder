import { IElement } from '../email-customizer';

export interface ITemplate {
  id: string;
  name: string;
  template_title: string;
  status: 'active' | 'inactive';
  recipient?: string | null;
  source: string;
  last_updated: string;
  elements: IElement[];
  background_color: string;
  text_link_color: string;
  content_background_color: string;
  content_text_color: string;
  title_color: string;
  preheader?: string;
  /** WooCommerce email subject (read from WC settings, not stored in YayMail post meta). */
  email_subject?: string | null;
  support_status?: 'already_supported' | 'addon_needed' | 'pro_needed' | 'not_supported';
  addon_info?: {
    plugin_name: string;
    template_ids: string[];
    link_upgrade: string;
    is_3rd_party_installed: boolean;
  };
  global_header_settings: {
    content_override: boolean;
    heading_content: string;
    hidden: boolean;
  };
  global_footer_settings: {
    content_override: boolean;
    footer_content: string;
    hidden: boolean;
  };
}
