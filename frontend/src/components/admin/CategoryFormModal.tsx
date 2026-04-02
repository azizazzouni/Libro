import { useState } from 'react';
import { X } from 'lucide-react';
import { Category } from '../../types';
import { categoriesApi } from '../../api/categoriesApi';
import { Spinner } from '../ui/Spinner';

interface Props {
  category?: Category | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export function CategoryFormModal({ category, categories, onClose, onSaved }: Props) {
  const isEdit = !!category;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    parentId: category?.parentId ? String(category.parentId) : '',
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setError('Le nom est obligatoire.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        parentId: form.parentId ? Number(form.parentId) : undefined,
      };
      if (isEdit) {
        await categoriesApi.update(category!.id, payload);
      } else {
        await categoriesApi.create(payload);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {isEdit ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-parchment transition-colors">
            <X size={18} className="text-ink-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input"
              placeholder="Nom de la catégorie"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className="input resize-none"
              rows={3}
              placeholder="Description de la catégorie..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Catégorie parente <span className="text-ink-400 font-normal">(optionnel)</span>
            </label>
            <select
              value={form.parentId}
              onChange={(e) => set('parentId', e.target.value)}
              className="input"
            >
              <option value="">Aucune — catégorie principale</option>
              {categories
                .filter((c) => c.id !== category?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-ink-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading && <Spinner size="sm" />}
              {isEdit ? 'Enregistrer' : 'Créer la catégorie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
