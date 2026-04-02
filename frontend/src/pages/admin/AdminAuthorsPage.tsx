import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { authorsApi } from '../../api/authorsApi';
import { Author } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { AuthorFormModal } from '../../components/admin/AuthorFormModal';

export function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const fetchAuthors = () => {
    setLoading(true);
    authorsApi
      .getAll({ search, limit: 50 })
      .then(({ data }) => {
        setAuthors(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAuthors();
  }, [search]);

  const handleAdd = () => {
    setSelectedAuthor(null);
    setModalOpen(true);
  };
  const handleEdit = (author: Author) => {
    setSelectedAuthor(author);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet auteur et tous ses livres ?')) return;
    await authorsApi.delete(id);
    fetchAuthors();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Auteurs</h1>
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un auteur..."
          className="input pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-parchment text-ink-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 text-left">Nom</th>
                <th className="px-5 py-3 text-left hidden md:table-cell">Biographie</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-50">
              {authors.map((author) => (
                <tr key={author.id} className="hover:bg-parchment/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-ink-900">{author.name}</td>
                  <td className="px-5 py-3 text-ink-400 hidden md:table-cell">
                    <span className="line-clamp-1">{author.bio || '—'}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Pencil size={14} className="text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {authors.length === 0 && (
            <div className="text-center py-12 text-ink-400 text-sm">Aucun auteur trouvé.</div>
          )}
        </div>
      )}

      {modalOpen && (
        <AuthorFormModal
          author={selectedAuthor}
          onClose={() => setModalOpen(false)}
          onSaved={fetchAuthors}
        />
      )}
    </div>
  );
}
