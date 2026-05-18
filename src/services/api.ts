import axios from 'axios';
import type { StudySettings, Vocabulary, VocabularyApiResponse } from '../types';
const API_BASE_URL = import.meta.env.VITE_BASE_API;

export async function getVocabulary(page: string): Promise<VocabularyApiResponse> {
  const { data } = await axios.get(`${API_BASE_URL}/vocabulary`, {
    params: { page, limit: 10 },
  });
  return data;
}

export async function createVocabulary(vocab: Vocabulary): Promise<Vocabulary> {
  const response = await axios.post(`${API_BASE_URL}/vocabulary`, vocab);
  return response.data;
}

export async function updateVocabulary(
  id: string,
  updates: Partial<Vocabulary>,
): Promise<Vocabulary> {
  const response = await axios.patch(`${API_BASE_URL}/vocabulary/${id}`, updates);
  return response.data;
}

export async function deleteVocabulary(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/vocabulary/${id}`);
}

export async function getSettings(): Promise<StudySettings> {
  const { data } = await axios.get(`${API_BASE_URL}/settings`);
  return data;
}

export async function updateSettings(settings: StudySettings): Promise<StudySettings> {
  const response = await axios.patch(`${API_BASE_URL}/settings`, settings);
  return response.data;
}
