import { useEffect, useState, useCallback } from 'react';
import { booksApi, BookFilters } from '../api/booksApi';
import { categoriesApi } from '../api/categoriesApi';
import { Book, Category, PaginatedMeta } from '../types';
import { BookCard } from '../components/book/BookCard';
import { BookFilters as BookFiltersComponent } from '../components/book/BookFilters';
import { Pagination } from '../components/ui/Pagination';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

export function CataloguePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<BookFilters & { search: string }>({
    search: '', page: 1, limit: 12,
  });

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data.data));
  }, []);

  const fetchBooks = useCallback(() => {
    setLoading(true);
    booksApi.getAll(filters).then(({ data }) => {
      setBooks(data.data);
      setMeta(data.meta);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filters]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters({ ...newFilters, page: 1, limit: 12 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 mb-1">Catalogue</h1>
        {meta && <p className="text-sm text-ink-500">{meta.total} livre{meta.total > 1 ? 's' : ''} disponible{meta.total > 1 ? 's' : ''}</p>}
      </div>

      <BookFiltersComponent filters={filters} categories={categories} onChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : books.length === 0 ? (
        <EmptyState title="Aucun livre trouvé" description="Essayez de modifier vos filtres de recherche." />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
          {meta && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          )}
        </>
      )}
    </div>
  );
}
