import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Book, Author, Category } from '../../types';
import { authorsApi } from '../../api/authorsApi';
import { categoriesApi } from '../../api/categoriesApi';
import { booksApi } from '../../api/booksApi';
import { Spinner } from '../ui/Spinner';

interface Props {
  book?: Book | null;
  onClose: () => void;
  onSaved: () => void;
}

interface FormData {
  title: string;
  description: string;
  isbn: string;
  price: string;
  stock: string;
  language: string;
  pages: string;
  coverUrl: string;
  authorId: string;
  categoryIds: number[];
}

export function BookFormModal({ book, onClose, onSaved }: Props) {
  const isEdit = !!book;
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormData>({
    title: book?.title || '',
    description: book?.description || '',
    isbn: book?.isbn || '',
    price: book ? String(book.price) : '',
    stock: book ? String(book.stock) : '0',
    language: book?.language || 'fr',
    pages: book?.pages ? String(book.pages) : '',
    coverUrl: book?.coverUrl || '',
    authorId: book ? String(book.author.id) : '',
    categoryIds: book ? book.categories.map((c) => c.category.id) : [],
  });

  useEffect(() => {
    Promise.all([authorsApi.getAll({ limit: 100 }), categoriesApi.getAll()]).then(([a, c]) => {
      setAuthors(a.data.data);
      setCategories(c.data.data);
    });
  }, []);

  const set = (field: keyof FormData, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const toggleCategory = (id: number) =>
    setForm((f) => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter((c) => c !== id)
        : [...f.categoryIds, id],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.authorId) {
      setError('Titre, prix et auteur sont obligatoires.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        title: form.title,
        description: form.description || undefined,
        isbn: form.isbn || undefined,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        language: form.language,
        pages: form.pages ? parseInt(form.pages) : undefined,
        coverUrl: form.coverUrl || undefined,
        authorId: parseInt(form.authorId),
        categoryIds: form.categoryIds,
      };

      if (isEdit) {
        await booksApi.update(book!.id, payload);
      } else {
        await booksApi.create(payload);
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 sticky top-0 bg-white z-10">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {isEdit ? 'Modifier le livre' : 'Ajouter un livre'}
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
              Titre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="input"
              placeholder="Le titre du livre"
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
              placeholder="Description du livre..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Auteur <span className="text-red-400">*</span>
            </label>
            <select
              value={form.authorId}
              onChange={(e) => set('authorId', e.target.value)}
              className="input"
              required
            >
              <option value="">Sélectionner un auteur</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Prix (€) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                className="input"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Stock</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">ISBN</label>
              <input
                type="text"
                value={form.isbn}
                onChange={(e) => set('isbn', e.target.value)}
                className="input"
                placeholder="978-..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Pages</label>
              <input
                type="number"
                min="1"
                value={form.pages}
                onChange={(e) => set('pages', e.target.value)}
                className="input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Langue</label>
              <select
                value={form.language}
                onChange={(e) => set('language', e.target.value)}
                className="input"
              >
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="es">Espagnol</option>
                <option value="de">Allemand</option>
                <option value="ar">Arabe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                URL de couverture
              </label>
              <input
                type="url"
                value={form.coverUrl}
                onChange={(e) => set('coverUrl', e.target.value)}
                className="input"
                placeholder="https://..."
              />
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Catégories</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                      form.categoryIds.includes(cat.id)
                        ? 'bg-ink-900 text-cream border-ink-900'
                        : 'bg-white text-ink-600 border-ink-200 hover:bg-parchment'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-ink-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading && <Spinner size="sm" />}
              {isEdit ? 'Enregistrer' : 'Créer le livre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
