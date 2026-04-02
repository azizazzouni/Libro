import { useState } from 'react';
import { X } from 'lucide-react';
import { Author } from '../../types';
import { authorsApi } from '../../api/authorsApi';
import { Spinner } from '../ui/Spinner';

interface Props {
  author?: Author | null;
  onClose: () => void;
  onSaved: () => void;
}

export function AuthorFormModal({ author, onClose, onSaved }: Props) {
  const isEdit = !!author;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: author?.name || '',
    bio: author?.bio || '',
    photoUrl: author?.photoUrl || '',
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
      if (isEdit) {
        await authorsApi.update(author!.id, form);
      } else {
        await authorsApi.create(form);
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
            {isEdit ? "Modifier l'auteur" : 'Ajouter un auteur'}
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
              placeholder="Nom de l'auteur"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Biographie</label>
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              className="input resize-none"
              rows={4}
              placeholder="Biographie de l'auteur..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">URL de photo</label>
            <input
              type="url"
              value={form.photoUrl}
              onChange={(e) => set('photoUrl', e.target.value)}
              className="input"
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-ink-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading && <Spinner size="sm" />}
              {isEdit ? 'Enregistrer' : "Créer l'auteur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
