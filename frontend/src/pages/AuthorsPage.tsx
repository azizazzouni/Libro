import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Search } from 'lucide-react';
import { authorsApi } from '../api/authorsApi';
import { Author } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

export function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    authorsApi.getAll({ search, limit: 50 })
      .then(({ data }) => { setAuthors(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 mb-4">Auteurs</h1>
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher un auteur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : authors.length === 0 ? (
        <EmptyState title="Aucun auteur trouvé" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {authors.map((author) => (
            <div key={author.id} className="card p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-parchment flex items-center justify-center flex-shrink-0 overflow-hidden">
                {author.photoUrl ? (
                  <img src={author.photoUrl} alt={author.name} className="w-full h-full object-cover" />
                ) : <User size={20} className="text-ink-400" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-ink-900 truncate">{author.name}</h3>
                {author.bio && <p className="text-xs text-ink-400 mt-1 line-clamp-2">{author.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
