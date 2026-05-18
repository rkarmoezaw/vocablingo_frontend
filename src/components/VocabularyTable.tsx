import { Edit2, RotateCcw, Star, Trash2, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { speakWord } from '../lib/speechUtils';
import type { Vocabulary } from '../types';
import { CEFRBadge } from './CEFRBadge';

interface VocabularyTableProps {
  data: Vocabulary[];
  onDelete: (id: string) => void;
  onEdit: (vocab: Vocabulary) => void;
  onToggleDifficult: (id: string) => void;
}

export default function VocabularyTable({
  data,
  onDelete,
  onEdit,
  onToggleDifficult,
}: VocabularyTableProps) {
  const speak = (text: string, slow: boolean = false) => {
    speakWord(text, { rate: slow ? 0.6 : 1.0 });
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6 flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest w-16">
                No.
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Word Name
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Phonetics
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Meaning
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                CEFR
              </th>
              <th className="px-4 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Form
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* <AnimatePresence> */}
            {data.map((item, index) => (
              <motion.tr
                key={item._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 40,
                  opacity: { duration: 0.2 },
                }}
                className="group hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-3 text-sm font-mono text-slate-400">
                  {(index + 1).toString().padStart(2, '0')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 block">{item.name}</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => speak(item.name)}
                        className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                        title="Normal Pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => speak(item.name, true)}
                        className="p-1 text-slate-400 hover:bg-slate-100 rounded transition-colors"
                        title="Slow Pronunciation"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs font-mono text-slate-500 italic">
                  {item.phonetics || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-slate-700 font-sans">
                    {item.burmeseMeaning}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CEFRBadge level={item.cefr} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.wordForm}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onToggleDifficult(item._id)}
                      className={`p-1.5 rounded transition-all ${item.isDifficult ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                      title={item.isDifficult ? 'Unmark Difficult' : 'Mark Difficult'}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isDifficult ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                      title="Edit Word"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                      title="Delete Word"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {/* </AnimatePresence> */}
            {data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Library Empty
                    </span>
                    <p className="text-sm font-medium italic">Start building your lexicon above</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Found <span className="text-slate-900">{data.length}</span> vocabulary entries
        </p>
        <div className="flex gap-1">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-400 cursor-not-allowed">
            Prev
          </button>
          <button className="px-3 py-1 bg-slate-900 text-white rounded text-[11px] font-bold shadow-sm">
            1
          </button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-400 cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
