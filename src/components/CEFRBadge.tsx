import { type CEFRLevel } from '../types';

interface CEFRBadgeProps {
  level: CEFRLevel;
  className?: string;
}

export function CEFRBadge({ level }: CEFRBadgeProps) {
  const getColors = (lvl: CEFRLevel) => {
    switch (lvl) {
      case 'A1':
      case 'A2':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'B1':
      case 'B2':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'C1':
      case 'C2':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`h-8 w-10 rounded-sm  flex justify-center items-center ${getColors(level)}`}>
      <span>{level}</span>
    </div>
  );
}
