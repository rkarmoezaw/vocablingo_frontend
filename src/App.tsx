import { FileDown, FileSpreadsheet, LanguagesIcon, Play } from 'lucide-react';
import { useState } from 'react';
import FilterBar from './components/FilterBar';
import VocabularyTable from './components/VocabularyTable';
import { useDeleteVocabulary, useUpdateVocabulary, useVocabulary } from './hooks/useVocabulary';
import type { CEFRLevel, Vocabulary } from './types';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCefr, setSelectedCefr] = useState<CEFRLevel | 'all'>('all');
  const [editingVocabulary, setEditingVocabulary] = useState<Vocabulary | null>(null);
  const [selectedWordForm, setSelectedWordForm] = useState('');
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error, isFetching, isSuccess } = useVocabulary(
    currentPage.toString(),
  );
  const deleteMutation = useDeleteVocabulary(currentPage.toString());
  const updateVocabMutation = useUpdateVocabulary(currentPage.toString());

  const vocabulary: Vocabulary[] = data?.data || [];
  const filteredAndSortedVocabulary = vocabulary
    .filter(v => {
      const matchesSearch =
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.engMeaning.toLowerCase().includes(search.toLowerCase());

      let matchesCefr = selectedCefr === 'all';
      if (!matchesCefr) {
        if (selectedCefr === 'A1') matchesCefr = v.cefr === 'A1' || v.cefr === 'A2';
        else if (selectedCefr === 'B1') matchesCefr = v.cefr === 'B1' || v.cefr === 'B2';
        else if (selectedCefr === 'C1') matchesCefr = v.cefr === 'C1' || v.cefr === 'C2';
        else matchesCefr = v.cefr === selectedCefr;
      }

      return matchesSearch && matchesCefr;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  function handleEdit(vocab: Vocabulary) {
    setEditingVocabulary(vocab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleToggleDifficult(id: string) {
    const item = vocabulary.find(v => v._id === id);
    if (!item) return;
    await updateVocabMutation.mutateAsync({ id, updates: { isDifficult: !item.isDifficult } });
  }

  async function handleDelete(id: string) {
    await deleteMutation.mutateAsync(id, {
      onSuccess: () => {
        console.log('Word successfully removed from database and cache!');
      },
      onError: error => {
        alert(`Failed to delete: ${error instanceof Error ? error.message : 'Unknown error'}`);
      },
    });
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <LanguagesIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              VocabLingo <span className="text-blue-600">LMS</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-0.5">
              English-Burmese Vocabulary Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">Created by R Kar Moe Zaw</div>
      </header>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 pb-2 space-y-4 shrink-0">
          {/* <VocabularyForm
            onAdd={handleAddOrUpdate}
            initialData={editingVocab}
            onCancelEdit={() => setEditingVocabulary(null)}
          /> */}
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Vocabulary Library
            </h3>
            <div className="flex items-center gap-2">
              <>
                <button
                  title="Export to PDF"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-slate-200 hover:border-slate-300 text-slate-600 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  PDF
                </button>
                <button
                  title="Export to Excel"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-slate-200 hover:border-slate-300 text-slate-600 text-[10px] uppercase font-bold tracking-widest rounded-lg transition-all"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Excel
                </button>
              </>

              <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] uppercase font-bold tracking-widest rounded-lg shadow-lg shadow-blue-100 transition-all">
                <Play className="w-3.5 h-3.5 fill-current" />
                Study Flashcards
              </button>
            </div>
          </div>
          <FilterBar />
        </div>

        {/* Table  */}
        <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
          <VocabularyTable
            data={filteredAndSortedVocabulary}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleDifficult={handleToggleDifficult}
          />
        </div>
      </div>

      {isStudyMode && 'FlashcardModal'}
    </div>
  );
}
