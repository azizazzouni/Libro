import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { authorsApi } from '../api/authorsApi';
import { booksApi } from '../api/booksApi';
import { Author, Book } from '../types';
import { BookCard } from '../components/book/BookCard';
import { Spinner } from '../components/ui/Spinner';

export function AuthorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<Author | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      authorsApi.getById(Number(id)),
      booksApi.getAll({ authorId: Number(id), limit: 20 }),
    ])
      .then(([authorRes, booksRes]) => {
        setAuthor(authorRes.data.data);
        setBooks(booksRes.data.data);
        setLoading(false);
      })
      .catch(() => navigate('/authors'));
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  if (!author) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      {/* Author header */}
      <div className="card p-8 mb-10 flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-parchment flex items-center justify-center flex-shrink-0 overflow-hidden">
          {author.photoUrl ? (
            <img src={author.photoUrl} alt={author.name} className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-ink-400" />
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900 mb-2">{author.name}</h1>
          {author.bio && <p className="text-ink-500 leading-relaxed max-w-2xl">{author.bio}</p>}
          <p className="text-sm text-ink-400 mt-3">
            {books.length} livre{books.length > 1 ? 's' : ''} disponible
            {books.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Books */}
      {books.length > 0 && (
        <>
          <h2 className="font-display text-2xl font-semibold text-ink-900 mb-6">
            Livres de {author.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
