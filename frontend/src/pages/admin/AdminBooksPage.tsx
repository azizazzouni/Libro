import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { booksApi } from '../../api/booksApi';
import { Book } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { BookFormModal } from '../../components/admin/BookFormModal';
import { formatPrice } from '../../utils/helpers';

export function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const fetchBooks = () => {
    setLoading(true);
    booksApi
      .getAll({ page, limit: 10, search })
      .then(({ data }) => {
        setBooks(data.data);
        setTotal(data.meta?.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [page, search]);

  const handleAdd = () => {
    setSelectedBook(null);
    setModalOpen(true);
  };

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce livre ?')) return;
    setDeleting(id);
    await booksApi.delete(id);
    fetchBooks();
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Livres</h1>
        <button onClick={handleAdd} className="btn-primary">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Rechercher un livre..."
          className="input pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-parchment text-ink-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Titre</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Auteur</th>
                  <th className="px-5 py-3 text-left hidden sm:table-cell">Prix</th>
                  <th className="px-5 py-3 text-left hidden sm:table-cell">Stock</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-parchment/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-10 bg-parchment rounded overflow-hidden flex-shrink-0">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">
                              📖
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-ink-900 line-clamp-1">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500 hidden md:table-cell">
                      {book.author.name}
                    </td>
                    <td className="px-5 py-3 font-medium hidden sm:table-cell">
                      {formatPrice(book.price)}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span
                        className={
                          book.stock === 0
                            ? 'text-red-500 font-medium'
                            : 'text-green-600 font-medium'
                        }
                      >
                        {book.stock}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={14} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={deleting === book.id}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          {deleting === book.id ? (
                            <Spinner size="sm" />
                          ) : (
                            <Trash2 size={14} className="text-red-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && (
              <div className="text-center py-12 text-ink-400 text-sm">Aucun livre trouvé.</div>
            )}
          </div>
          <Pagination page={page} totalPages={Math.ceil(total / 10)} onChange={setPage} />
        </>
      )}

      {modalOpen && (
        <BookFormModal
          book={selectedBook}
          onClose={() => setModalOpen(false)}
          onSaved={fetchBooks}
        />
      )}
    </div>
  );
}
