import { useMutation, useQuery, useQueryClient } from 'react-query';

import {
  deleteSavedTemplateLibrary,
  getTemplateLibraryList,
  getTemplateLibraryQueryKey,
  saveAsTemplateLibrary,
  SaveAsTemplatePayload,
  SAVED_TEMPLATE_ID_PREFIX,
  TemplateLibrarySummary,
} from '@src/common/api/templateLibraryApi';

interface IUseTemplateLibraryListProps {
  email_type?: string | null;
  isEnabled?: boolean;
}

export function useTemplateLibraryList(props?: IUseTemplateLibraryListProps) {
  const { email_type = 'new_order', isEnabled = false } = props ?? {};

  const resolvedEmailType =
    email_type ?? (window.yaymailData.is_yaymail_loader ? 'new_order' : 'wp-core-mail');

  return useQuery({
    queryKey: getTemplateLibraryQueryKey(resolvedEmailType),
    queryFn: async () => {
      const response = await getTemplateLibraryList({
        email_type: resolvedEmailType,
      });
      return response.data?.templates ?? [];
    },
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  });
}

export function useSaveAsTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveAsTemplatePayload) => {
      const response = await saveAsTemplateLibrary(payload);
      if (response.data?.success !== true) {
        throw new Error(response.data?.message ?? 'Failed to save template');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (!data.effect_emails?.length || !data.public_ids?.length) {
        return;
      }

      data.effect_emails.forEach((emailType: string, index: number) => {
        const publicId = data.public_ids[index];
        if (!publicId) {
          return;
        }

        const queryKey = getTemplateLibraryQueryKey(emailType);
        const oldData = queryClient.getQueryData<TemplateLibrarySummary[]>(queryKey);
        if (!Array.isArray(oldData)) {
          return;
        }

        queryClient.setQueryData(queryKey, [
          {
            id: `${SAVED_TEMPLATE_ID_PREFIX}${publicId}`,
            email_type: emailType,
            name: variables.name,
            elements: variables.elements,
            email_settings: variables.email_settings,
            source: 'saved',
            access: 'free',
            available: true,
          },
          ...oldData,
        ]);
      });
    },
  });
}

export function useDeleteSavedTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ publicId, email_type }: { publicId: string; email_type: string }) => {
      const response = await deleteSavedTemplateLibrary(publicId);
      if (response.data?.success !== true) {
        throw new Error(response.data?.message ?? 'Failed to delete template');
      }
      return { response: response.data, email_type };
    },
    onSuccess: ({ email_type }, { publicId }) => {
      queryClient.setQueryData(getTemplateLibraryQueryKey(email_type), (oldData: any) => {
        if (!oldData) return oldData;
        if (!Array.isArray(oldData)) {
          return oldData;
        }
        return oldData.filter(
          (template: TemplateLibrarySummary) =>
            template.id !== `${SAVED_TEMPLATE_ID_PREFIX}${publicId}`,
        );
      });
    },
  });
}
