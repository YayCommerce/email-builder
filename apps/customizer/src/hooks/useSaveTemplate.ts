/* eslint-disable no-unused-vars */
import { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import useTemplateQueries from '@src/hooks/queries/useTemplateQueries';
import { publishCustomEvent } from '@src/hooks/useCustomEvent';

import { UpdateTemplatePayloadType } from '@src/common/api/types';
import { removeIconFromElements } from '@src/features/email-customizer/utils';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomNotificationStore from '@src/stores/notification';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';
import useTemplateContentHistoryStore from '@src/stores/templateContentHistory';

export type UseSaveTemplateProps = {
  onSaveSuccess?: (data: UpdateTemplatePayloadType) => void;
  onSaveFailed?: () => void;
};

const useSaveTemplate = (props?: UseSaveTemplateProps) => {
  const { onSaveSuccess, onSaveFailed } = props || {};
  const templateData = useCustomizerPageStore((state) => state.templateData);

  const backgroundColor = useCustomizerPageStore(
    (state) =>
      state.templateData?.background_color ?? window.yaymailData.colors.default_background_color,
  );
  const textLinkColor = useCustomizerPageStore(
    (state) =>
      state.templateData?.text_link_color ?? window.yaymailData.colors.default_text_link_color,
  );
  const contentBackgroundColor = useCustomizerPageStore(
    (state) =>
      state.templateData?.content_background_color ??
      window.yaymailData.colors.default_content_background_color,
  );
  const contentTextColor = useCustomizerPageStore(
    (state) =>
      state.templateData?.content_text_color ??
      window.yaymailData.colors.default_content_text_color,
  );
  const titleColor = useCustomizerPageStore(
    (state) => state.templateData?.title_color ?? window.yaymailData.colors.default_title_color,
  );
  const preheader = useCustomizerPageStore((state) => state.templateData?.preheader ?? '');
  const emailSubject = useCustomizerPageStore((state) => state.templateData?.email_subject);
  const selectedTemplate = useCustomizerPageStore((state) => state.currentTemplate);

  const { updateTemplateMutation } = useTemplateQueries({
    template_name: selectedTemplate,
    fetch: false,
  });

  const notify = useCustomNotificationStore((state) => state.notify);

  const navigate = useNavigate();
  const navigatingPath = useTemplateContentStore((state) => state.navigatingPath);

  const clearNavigatingPath = useTemplateContentStore((state) => state.clearNavigatingPath);
  const queryClient = useQueryClient();
  const { data: templateQueriesData } = useTemplateQueries({ template_name: selectedTemplate });

  const setHasRedo = useTemplateContentHistoryStore((state) => state.setHasRedo);

  const [isLoading, setIsLoading] = useState(false);

  const saveTemplate = async () => {
    setIsLoading(true);
    const data: UpdateTemplatePayloadType = {
      template_id: (templateData?.id ?? '').toString(),
      template_elements: removeIconFromElements(useTemplateContentStore.getState().list),
      background_color: backgroundColor,
      text_link_color: textLinkColor,
      content_background_color: contentBackgroundColor,
      content_text_color: contentTextColor,
      title_color: titleColor,
      preheader,
      ...(emailSubject !== null && emailSubject !== undefined
        ? { email_subject: emailSubject }
        : {}),
      global_header_settings: templateData?.global_header_settings,
      global_footer_settings: templateData?.global_footer_settings,
    };

    try {
      const response = await updateTemplateMutation.mutateAsync(data);
      if (response) {
        useTemplateContentStore.setState(() => ({
          hasChanged: false,
        }));

        queryClient.setQueryData(['template', selectedTemplate], {
          ...templateQueriesData,
          background_color: data.background_color,
          content_background_color: data.content_background_color,
          content_text_color: data.content_text_color,
          text_link_color: data.text_link_color,
          title_color: data.title_color,
          elements: data.template_elements,
          preheader,
          email_subject: emailSubject,
        });
        notify?.('success', __('Save success', 'yaymail'));
        onSaveSuccess?.(data);
        setHasRedo(false);
        if (navigatingPath) navigate(navigatingPath);

        return;
      }

      notify?.('error', __('Save failed', 'yaymail'));
      onSaveFailed?.();
    } catch (err) {
      console.error('YayMail Error during save: ', err);
      notify?.('error', __('Save failed', 'yaymail'));
      onSaveFailed?.();
    } finally {
      setIsLoading(false);
      clearNavigatingPath();
    }
  };

  const interceptedSaveTemplate = useCallback(async () => {
    if (window.yaymailData.shared.activated_addons.includes('yaymail_addon_conditional_logic')) {
      const addonResponse = await new Promise<'save' | 'cancel'>((resolve, reject) => {
        publishCustomEvent('onYayMailBeforeSaveTemplate', { resolve, reject });
      });
      if (addonResponse === 'save') {
        saveTemplate();
      }
      return;
    }
    saveTemplate();
  }, [saveTemplate]);

  return { saveFunction: interceptedSaveTemplate, isLoading };
};

export default useSaveTemplate;
