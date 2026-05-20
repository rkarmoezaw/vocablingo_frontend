export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type WordForm = 'Noun' | 'Verb' | 'Adj' | 'Adv' | 'Prep' | 'Conj' | 'Interj' | 'Pron';

export interface Vocabulary {
  _id?: string;
  name: string;
  engMeaning: string;
  burmeseMeaning: string;
  cefr: CEFRLevel;
  wordForm: WordForm;
  phonetics: string;
  isDifficult?: boolean;
}

export interface StudySettings {
  showPhonetics: boolean;
  order: 'alphabetical' | 'random' | 'chronological';
  onlyDifficult?: boolean;
  cefrFilter?: CEFRLevel[];
}

export const CEFR_LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
export const WORD_FORMS: WordForm[] = [
  'Noun',
  'Verb',
  'Adj',
  'Adv',
  'Prep',
  'Conj',
  'Interj',
  'Pron',
];

export interface PaginationInfo {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface VocabularyApiResponse {
  success: boolean;
  data: Vocabulary[];
  pagination: PaginationInfo;
}
