/* eslint-disable no-restricted-imports */
import { Key } from 'antd/es/table/interface';

import { ITemplate } from '@src/features/email-templates/types';

import restApi from './api';
import { UpdateTemplatePayloadType } from './types';

export async function getTemplates() {
  const templates = await restApi.get('/templates');
  return templates;
}

export async function getTemplateByName(template_name: string) {
  const template = await restApi.get(`/templates/get-template-by-name`, {
    params: {
      template_name: template_name,
    },
  });
  return template;
}

export async function updateTemplate(data: UpdateTemplatePayloadType) {
  const templateID = data.template_id;
  const response = await restApi.post(`/templates/${templateID}`, {
    data: JSON.stringify(data),
  });
  return response;
}

export async function changeStatuses(data: { list_id: Key[]; status: ITemplate['status'] }) {
  const response = await restApi.post('/templates/change-status', {
    list_id: data.list_id,
    status: data.status,
  });
  return response.data;
}

export async function resetTemplates(list_id: Key[]) {
  const response = await restApi.post('/templates/reset', {
    list_id: list_id,
  });
  return response.data;
}

export async function copyTemplate(data: { template_id: string; from_template: string }) {
  const response = await restApi.post('/templates/copy-template', {
    template_id: data.template_id,
    from_template: data.from_template,
  });
  return response.data;
}

export async function getElements(template_name: string) {
  const elements = await restApi.get(`/templates/${template_name}/all-elements`);
  return elements;
}

export async function getShortcodes(template_name: string, order_id?: string) {
  const orderParams = order_id ? order_id : 'sample_order';
  const shortcodes = await restApi.get(`/templates/${template_name}/all-shortcodes/${orderParams}`);
  return shortcodes;
}

export async function changeGlobalHeaderFooterStatus(status: boolean, platform: string) {
  const response = await restApi.post('/templates/global-header-footer/change-status', {
    status,
    platform,
  });
  return response.data;
}
