import { useMutation, useQueryClient } from 'react-query';

import { activateAddon, deactivateAddon } from '@src/common/api/addonApi';

function useAddonMutations() {
  const queryClient = useQueryClient();
  const activateAddonMutation = useMutation({
    mutationFn: activateAddon,
    onSuccess: (axiosResponse, payload) => {
      if (axiosResponse.data?.success) {
        queryClient.setQueryData(['addons'], (old: any) => {
          return old.map((addon: any) => {
            if (addon.plugin_slug === payload) {
              addon.installation_status.is_active = true;
            }
            return addon;
          });
        });
      }
    },
  });

  const deactivateAddonMutation = useMutation({
    mutationFn: deactivateAddon,
    onSuccess: (axiosResponse, payload) => {
      if (axiosResponse.data?.success) {
        queryClient.setQueryData(['addons'], (old: any) => {
          return old.map((addon: any) => {
            if (addon.plugin_slug === payload) {
              addon.installation_status.is_active = false;
            }
            return addon;
          });
        });
      }
    },
  });

  return {
    activateAddonMutation,
    deactivateAddonMutation,
  };
}

export default useAddonMutations;
