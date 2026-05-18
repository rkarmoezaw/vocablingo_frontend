import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useCreateVocabulary } from '../hooks/useVocabulary';
import { CEFR_LEVELS, WORD_FORMS, type CEFRLevel, type Vocabulary, type WordForm } from '../types';

interface VocabularyFormProps {
  onAdd: (vocab: Vocabulary) => Promise<void>;
  initialData?: Vocabulary | null;
  onCancelEdit?: () => void;
}

export default function VocabularyForm({ onAdd, initialData, onCancelEdit }: VocabularyFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [phonetics, setPhonetics] = useState(initialData?.phonetics || '');
  const [engMeaning, setEngMeaning] = useState(initialData?.engMeaning || '');
  const [burmeseMeaning, setBurmeseMeaning] = useState(initialData?.burmeseMeaning || '');
  const [cefr, setCefr] = useState<CEFRLevel>(initialData?.cefr || 'A1');
  const [wordForm, setWordForm] = useState<WordForm>(initialData?.wordForm || 'Noun');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, isPending, isError, error } = useCreateVocabulary();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!name || !engMeaning || !burmeseMeaning) return;
    if (isSubmitting) return;
    setIsSubmitting(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={'bg-white p-6 rounded-xl shadow-sm border transition-all border-slate-200 mb-8'}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
          {initialData ? 'Update Vocabulary Entry' : 'New Vocabulary Entry'}
        </h2>
        {initialData && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700"
          >
            Cancel Edit
          </button>
        )}
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3 space-y-1.5">
          <label
            htmlFor="word"
            className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            Word (English)
          </label>
          <input
            id="word"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Resilience"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            required
          />
        </div>

        <div className="col-span-12 md:col-span-2 space-y-1.5">
          <label
            htmlFor="phonetics"
            className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            Phonetics
          </label>
          <input
            id="phonetics"
            type="text"
            value={phonetics}
            onChange={e => setPhonetics(e.target.value)}
            placeholder="/rɪˈzɪliəns/"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono italic"
          />
        </div>

        <div className="col-span-12 md:col-span-3 space-y-1.5">
          <label
            htmlFor="meaning"
            className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            Burmese Meaning
          </label>
          <input
            id="meaning"
            type="text"
            value={engMeaning}
            onChange={e => setEngMeaning(e.target.value)}
            placeholder="ကြံ့ကြံ့ခံနိုင်စွမ်း"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans font-medium"
            required
          />
        </div>

        <div className="col-span-6 md:col-span-2 space-y-1.5">
          <label
            htmlFor="cefr"
            className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            CEFR
          </label>
          <select
            id="cefr"
            value={cefr}
            onChange={e => setCefr(e.target.value as CEFRLevel)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            {CEFR_LEVELS.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-6 md:col-span-2 space-y-1.5">
          <label
            htmlFor="wordForm"
            className="text-[10px] uppercase font-bold text-slate-400 tracking-wider"
          >
            Form
          </label>
          <select
            id="wordForm"
            value={wordForm}
            onChange={e => setWordForm(e.target.value as WordForm)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            {WORD_FORMS.map(form => (
              <option key={form} value={form}>
                {form}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-12 md:col-span-1 flex items-end pb-0.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-9.5 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-widest rounded-md transition-all shadow-lg shadow-blue-100"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : initialData ? (
              'Update'
            ) : (
              'Add'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
