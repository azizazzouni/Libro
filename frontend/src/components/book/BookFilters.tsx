import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { Category } from '../../types';

interface Filters {
  search: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
}

interface Props {
  filters: Filters;
  categories: Category[];
  onChange: (f: Filters) => void;
}

export function BookFilters({ filters, categories, onChange }: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const reset = () => onChange({ search: '', categoryId: undefined, minPrice: undefined, maxPrice: undefined, language: undefined });
  const hasActive = filters.search || filters.categoryId || filters.minPrice || filters.maxPrice || filters.language;

  return (
    <div className="bg-white rounded-xl border border-ink-100 p-4 mb-6 space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher un livre, un auteur..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="input pl-9"
          />
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${showAdvanced ? 'bg-ink-900 text-cream border-ink-900' : 'border-ink-200 text-ink-600 hover:bg-parchment'}`}
        >
          <SlidersHorizontal size={16} />
          Filtres
        </button>
        {hasActive && (
          <button onClick={reset} className="flex items-center gap-1 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">
            <X size={16} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-ink-100 animate-fade-in">
          <div>
            <label className="text-xs font-medium text-ink-500 block mb-1">Catégorie</label>
            <select
              value={filters.categoryId || ''}
              onChange={(e) => update({ categoryId: e.target.value ? Number(e.target.value) : undefined })}
              className="input"
            >
              <option value="">Toutes</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500 block mb-1">Prix min (€)</label>
            <input
              type="number"
              min={0}
              value={filters.minPrice || ''}
              onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="input"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500 block mb-1">Prix max (€)</label>
            <input
              type="number"
              min={0}
              value={filters.maxPrice || ''}
              onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="input"
              placeholder="999"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-500 block mb-1">Langue</label>
            <select
              value={filters.language || ''}
              onChange={(e) => update({ language: e.target.value || undefined })}
              className="input"
            >
              <option value="">Toutes</option>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
              <option value="es">Espagnol</option>
              <option value="de">Allemand</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
