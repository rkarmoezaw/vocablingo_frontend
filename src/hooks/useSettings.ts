import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../services/api';
import type { StudySettings } from '../types';

const settingsKeys = {
  all: ['settings'] as const,
};

export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: getSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: StudySettings) => updateSettings(settings),
    onSuccess: data => {
      queryClient.setQueryData(settingsKeys.all, data);
    },
  });
}
