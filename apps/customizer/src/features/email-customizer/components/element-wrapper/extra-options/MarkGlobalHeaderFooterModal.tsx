import React, { useCallback, useMemo, useState } from 'react';

import { Form, Modal, Radio, Space } from 'antd';

import { ModalFooter, ModalHeader } from '@src/components/modal-header-footer';

import { getTemplateByName, updateTemplate } from '@src/common/api/templateApi';
import { UpdateTemplatePayloadType } from '@src/common/api/types';
import { getGlobalHeaderFooterKey } from '@src/common/platform';
import { IElement } from '@src/features/email-customizer';
import { removeIconFromElements, renewElementId } from '@src/features/email-customizer/utils';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomNotificationStore from '@src/stores/notification';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import styles from '@src/components/modal-header-footer/styles.module.scss';

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  elementIds: IElement['id'][];
}

type FormValues = {
  section: 'header' | 'footer';
};

const collectSelectedElementsByListOrder = (
  list: IElement[],
  selectedIds: (string | number)[],
): IElement[] => {
  const selectedIdSet = new Set(selectedIds.filter(Boolean));
  const result: IElement[] = [];

  const traverse = (elements: IElement[]) => {
    for (const item of elements) {
      if (selectedIdSet.has(String(item.id))) {
        result.push(item);
      }
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    }
  };

  traverse(list);
  return result;
};

const MarkGlobalHeaderFooterModal: React.FC<IModalProps> = ({ isOpen, onClose, elementIds }) => {
  const [form] = Form.useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setGlobalHeaderFooter = useCustomizerPageStore((state) => state.setGlobalHeaderFooter);
  const notify = useCustomNotificationStore((state) => state.notify);

  const selectedCount = useMemo(
    () => elementIds.filter((id) => id != null && id !== '').length,
    [elementIds],
  );

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    const formValues = form.getFieldsValue();
    const selectedSection = formValues.section;

    if (!selectedSection) {
      notify?.('error', __('Please select a section', 'yaymail'));
      return;
    }

    const list = useTemplateContentStore.getState().list;
    const selectedIds = elementIds.filter((id) => id != null && id !== '');

    const selectedElements = removeIconFromElements(
      collectSelectedElementsByListOrder(list, selectedIds),
    ) as IElement[];

    // Avoid element.id collisions between current template and global header/footer template.
    const selectedElementsWithNewIds = selectedElements.map((el) => renewElementId(el));

    if (selectedElements.length < 1) {
      notify?.('error', __('No valid selected elements', 'yaymail'));
      return;
    }

    try {
      setIsSubmitting(true);

      const templateResponse = await getTemplateByName(
        getGlobalHeaderFooterKey(),
      );
      const globalTemplate = templateResponse?.data;

      if (!globalTemplate?.id) {
        notify?.('error', __('Global header/footer template not found', 'yaymail'));
        return;
      }

      const existingElements = (globalTemplate.elements ?? []) as IElement[];
      const dividerIndex = existingElements.findIndex((el) => el.type === 'skeleton_divider');

      if (dividerIndex < 0) {
        notify?.('error', __('Invalid global header/footer template structure', 'yaymail'));
        return;
      }

      const dividerElement = existingElements[dividerIndex];
      const oldHeaderElements = existingElements.slice(0, dividerIndex);
      const oldFooterElements = existingElements.slice(dividerIndex + 1);

      const newHeaderElements =
        selectedSection === 'header' ? selectedElementsWithNewIds : oldHeaderElements;
      const newFooterElements =
        selectedSection === 'footer' ? selectedElementsWithNewIds : oldFooterElements;

      const payload: UpdateTemplatePayloadType = {
        template_id: String(globalTemplate.id),
        template_elements: [...newHeaderElements, dividerElement, ...newFooterElements],
        background_color: globalTemplate.background_color ?? '',
        text_link_color: globalTemplate.text_link_color ?? '',
        content_background_color: globalTemplate.content_background_color ?? '',
        content_text_color: globalTemplate.content_text_color ?? '',
        title_color: globalTemplate.title_color ?? '',
        global_header_settings: globalTemplate.global_header_settings,
        global_footer_settings: globalTemplate.global_footer_settings,
      };

      await updateTemplate(payload);

      const builder = window.yaymailData.builder;

      if (builder) {
        (builder as any).global_headers_footers = {
          global_header_elements: newHeaderElements,
          global_footer_elements: newFooterElements,
        };
      }

      setGlobalHeaderFooter({
        globalHeaderElements: newHeaderElements,
        globalFooterElements: newFooterElements,
      });

      notify?.('success', __('Global header/footer updated', 'yaymail'));
      onClose();
    } catch (error) {
      console.error(error);
      notify?.('error', __('Failed to update global header/footer', 'yaymail'));
    } finally {
      setIsSubmitting(false);
    }
  }, [elementIds, form, notify, onClose, setGlobalHeaderFooter]);

  return (
    <Modal
      title={
        <ModalHeader
          content={
            <h4 className={styles['modal_header_title']}>
              {__('Mark as global header/footer', 'yaymail')}
            </h4>
          }
        />
      }
      className="yaymail-global__modal"
      open={isOpen}
      onCancel={handleCancel}
      centered
      width="500px"
      footer={
        <ModalFooter
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText={__('Submit', 'yaymail')}
          isLoading={isSubmitting}
          isButtonOkDisabled={selectedCount < 1}
        />
      }
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form form={form} layout="vertical" preserve={false} initialValues={{ section: 'header' }}>
          <Form.Item<FormValues> label={__('Section', 'yaymail')} name="section">
            <Radio.Group>
              <Radio.Button value="header">{__('Global Header', 'yaymail')}</Radio.Button>
              <Radio.Button value="footer">{__('Global Footer', 'yaymail')}</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Space>
    </Modal>
  );
};

export default MarkGlobalHeaderFooterModal;
