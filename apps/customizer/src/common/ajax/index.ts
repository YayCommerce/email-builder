import { getPlatform } from '@src/common/platform';
import { ITemplate } from '@src/features/email-templates';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';

import {
  AjaxRequestType,
  ICustomHookProps,
  ITemplateOnLoadData,
  ITemplateOnLoadProps,
} from './type';

export async function previewEmail(template_data?: ITemplate | null, order_id?: string) {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_preview_mail',
        nonce: window.yaymailData.admin_ajax.nonce,
        order_id,
        template_data: JSON.stringify(template_data),
        unsaved_settings: useCustomizerSettingsStore.getState().settings,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function previewEmailOfWoo(
  template_name?: string,
  search_order_id?: string,
  email_address?: string,
) {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_preview_mail_for_woo',
        nonce: window.yaymailData.admin_ajax.nonce,
        template_name: template_name || '',
        search_order_id,
        email_address,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function sendTestMail(template_name?: string, order_id?: string, email?: string) {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_send_test_mail',
        nonce: window.yaymailData.admin_ajax.nonce,
        template_name: template_name || '',
        email,
        order_id,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    } else {
      window.yaymailData.test_email_address = response.data.email;
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function installYaySMTP(template_name?: string, order_id?: string, email?: string) {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_install_yaysmtp',
        nonce: window.yaymailData.admin_ajax.nonce,
        template_name: template_name || '',
        email,
        order_id,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }

    if (response.data.installed) {
      window.yaymailData.smtp.is_active = true;
    }

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function reviewYayMail() {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_review',
        nonce: window.yaymailData.admin_ajax.nonce,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function changeGhfTour(nextMove: 'initial' | 'second_move') {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_change_ghf_tour',
        nonce: window.yaymailData.admin_ajax.nonce,
        next_move: nextMove,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function dismissMultiSelectNotice() {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_dismiss_multi_select_notice',
        nonce: window.yaymailData.admin_ajax.nonce,
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

let customHookHtmlRequest: AjaxRequestType = null;
export function getCustomHookHtmlRequest(payload: ICustomHookProps) {
  // if (customHookHtmlRequest?.readyState !== 4) {
  //   customHookHtmlRequest?.abort();
  // }

  customHookHtmlRequest = window.jQuery.ajax({
    type: 'POST',
    url: window.yaymailData.admin_ajax.url,
    data: {
      action: 'yaymail_get_custom_hook_html',
      nonce: window.yaymailData.admin_ajax.nonce,
      data: payload,
    },
  });

  return customHookHtmlRequest;
}

export async function exportTemplates(templates: string[]) {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_export_templates',
        nonce: window.yaymailData.admin_ajax.nonce,
        templates,
        platform: getPlatform(),
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function importTemplates(import_files: FileList) {
  try {
    const formData = new FormData();
    Array.from(import_files).forEach((file: File) => {
      formData.append('file_' + file.name, file, file.name);
    });
    formData.append('action', 'yaymail_import_templates');
    formData.append('nonce', window.yaymailData.admin_ajax.nonce);
    const response = await window.jQuery.ajax({
      url: window.yaymailData.admin_ajax.url,
      type: 'POST',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

let templateDataOnloadRequest: AjaxRequestType = null;
export function getTemplateDataOnloadRequest(
  payload: ITemplateOnLoadProps,
  // eslint-disable-next-line no-undef
): JQuery.jqXHR<{ data: ITemplateOnLoadData }> {
  if (templateDataOnloadRequest?.readyState !== 4) {
    templateDataOnloadRequest?.abort();
  }

  templateDataOnloadRequest = window.jQuery.ajax({
    type: 'POST',
    url: window.yaymailData.admin_ajax.url,
    data: {
      action: 'yaymail_get_template_data_onload',
      nonce: window.yaymailData.admin_ajax.nonce,
      data: {
        ...payload,
        plugin_source: getPlatform(),
      },
    },
  });

  return templateDataOnloadRequest;
}

export async function exportState() {
  try {
    const response = await window.jQuery.ajax({
      type: 'POST',
      url: window.yaymailData.admin_ajax.url,
      data: {
        action: 'yaymail_export_state',
        nonce: window.yaymailData.admin_ajax.nonce,
        platform: getPlatform(),
      },
    });
    if (!response.success) {
      throw new Error('Call ajax failed');
    }
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function importState(import_file: File) {
  try {
    const formData = new FormData();
    formData.append('import_file', import_file, import_file.name);
    formData.append('action', 'yaymail_import_state');
    formData.append('nonce', window.yaymailData.admin_ajax.nonce);
    const response = await window.jQuery.ajax({
      url: window.yaymailData.admin_ajax.url,
      type: 'POST',
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
