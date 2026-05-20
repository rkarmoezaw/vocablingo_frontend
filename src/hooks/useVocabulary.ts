import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createVocabulary,
  deleteVocabulary,
  getVocabulary,
  updateVocabulary,
} from '../services/api';
import type { Vocabulary, VocabularyApiResponse } from '../types';

const vocabKeys = {
  all: ['vocabulary'] as const,
  lists: () => [...vocabKeys.all, 'list'] as const,
  list: (page: string) => [...vocabKeys.lists(), { page }] as const,
};

export function useVocabulary(page: string) {
  return useQuery<VocabularyApiResponse>({
    queryKey: vocabKeys.list(page),
    queryFn: () => getVocabulary(page),
    placeholderData: previousData => previousData,
  });
}

export function useCreateVocabulary(currentPage: string) {
  const queryClient = useQueryClient();
  const queryKey = vocabKeys.list(currentPage);

  return useMutation({
    mutationFn: (newVocab: Vocabulary) => createVocabulary(newVocab),

    onMutate: async newVocab => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<VocabularyApiResponse>(queryKey);

      if (previousData) {
        queryClient.setQueryData<VocabularyApiResponse>(queryKey, {
          ...previousData,
          data: [newVocab, ...(previousData.data || [])],
        });
      }
      return { previousData };
    },
    onError: (err, newVocab, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vocabKeys.lists() });
    },
  });
}

export function useUpdateVocabulary(currentPage: string) {
  const queryClient = useQueryClient();
  const queryKey = vocabKeys.list(currentPage);

  return useMutation({
    mutationFn: ({ _id, updates }: { _id: string; updates: Partial<Vocabulary> }) =>
      updateVocabulary(_id, updates),

    onMutate: async ({ _id, updates }) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<VocabularyApiResponse>(queryKey);

      if (previousData) {
        queryClient.setQueryData<VocabularyApiResponse>(queryKey, {
          ...previousData,
          data: previousData.data.map(vocab =>
            vocab._id === _id ? { ...vocab, ...updates } : vocab,
          ),
        });
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vocabKeys.lists() });
    },
  });
}

export function useDeleteVocabulary(currentPage: string) {
  const queryClient = useQueryClient();
  const queryKey = vocabKeys.list(currentPage);

  return useMutation({
    mutationFn: (_id: string) => deleteVocabulary(_id),

    onMutate: async _id => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<VocabularyApiResponse>(queryKey);

      if (previousData) {
        queryClient.setQueryData<VocabularyApiResponse>(queryKey, {
          ...previousData,
          data: previousData.data.filter(vocab => vocab._id !== _id),
        });
      }

      return { previousData };
    },
    onError: (err, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vocabKeys.lists() });
    },
  });
}
