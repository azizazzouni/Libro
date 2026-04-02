import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-ink-200 disabled:opacity-40 hover:bg-parchment transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-ink-900 text-cream'
                : 'border border-ink-200 hover:bg-parchment text-ink-700'
            }`}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-ink-200 disabled:opacity-40 hover:bg-parchment transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
