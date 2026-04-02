import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, BookOpen, Star } from 'lucide-react';
import { booksApi } from '../api/booksApi';
import { Book, Review } from '../types';
import { StarRating } from '../components/ui/StarRating';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice, formatDate, getAverageRating } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { addToCartThunk } from '../store/slices/cartSlice';

export function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // New review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!slug) return;
    booksApi.getBySlug(slug)
      .then(({ data }) => {
        setBook(data.data);
        setAvgRating(getAverageRating(data.data.reviews));
        return booksApi.getReviews(data.data.id, { limit: 20 });
      })
      .then(({ data }) => {
        setReviews((data as { data: Review[] }).data);
        setLoading(false);
      })
      .catch(() => { navigate('/catalogue'); });
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!book || !user) return;
    setAddingToCart(true);
    await dispatch(addToCartThunk({ bookId: book.id }));
    setAddingToCart(false);
  };

  const handleSubmitReview = async () => {
    if (!book || !user) return;
    setSubmittingReview(true);
    try {
      await booksApi.addReview(book.id, reviewForm);
      const { data } = await booksApi.getReviews(book.id, { limit: 20 });
      setReviews((data as { data: Review[] }).data);
      setReviewForm({ rating: 5, comment: '' });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;
  if (!book) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Cover */}
        <div className="aspect-[3/4] max-w-sm mx-auto w-full bg-parchment rounded-xl overflow-hidden shadow-xl">
          {book.coverUrl ? (
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={60} className="text-ink-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories.map(({ category }) => (
              <Badge key={category.id} variant="gold">{category.name}</Badge>
            ))}
          </div>

          <h1 className="font-display text-4xl font-bold text-ink-900 mb-2">{book.title}</h1>
          <Link to={`/authors/${book.author.id}`} className="text-ink-500 hover:text-ink-900 mb-4 transition-colors">
            par <span className="font-medium">{book.author.name}</span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <StarRating rating={avgRating} size={18} />
            <span className="text-sm text-ink-500">
              {avgRating.toFixed(1)} ({reviews.length} avis)
            </span>
          </div>

          {book.description && (
            <p className="text-ink-600 leading-relaxed mb-8">{book.description}</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-ink-600 mb-8">
            {book.pages && <div><span className="text-ink-400">Pages : </span><span className="font-medium text-ink-900">{book.pages}</span></div>}
            {book.isbn && <div><span className="text-ink-400">ISBN : </span><span className="font-medium text-ink-900">{book.isbn}</span></div>}
            <div><span className="text-ink-400">Langue : </span><span className="font-medium text-ink-900">{book.language.toUpperCase()}</span></div>
            {book.publishedAt && <div><span className="text-ink-400">Publié : </span><span className="font-medium text-ink-900">{formatDate(book.publishedAt)}</span></div>}
          </div>

          <div className="mt-auto border-t border-ink-100 pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-400 mb-0.5">Prix</p>
              <p className="font-display text-3xl font-bold text-ink-900">{formatPrice(book.price)}</p>
            </div>
            {book.stock > 0 ? (
              user ? (
                <button onClick={handleAddToCart} disabled={addingToCart} className="btn-primary px-8 py-3 text-base">
                  {addingToCart ? <Spinner size="sm" /> : <ShoppingCart size={18} />}
                  Ajouter au panier
                </button>
              ) : (
                <Link to="/login" className="btn-primary px-8 py-3 text-base">
                  Se connecter pour acheter
                </Link>
              )
            ) : (
              <span className="badge bg-red-100 text-red-700 px-4 py-2">Rupture de stock</span>
            )}
          </div>
        </div>
      </div>

      {/* Reviews section */}
      <div className="border-t border-ink-100 pt-12">
        <h2 className="font-display text-2xl font-semibold text-ink-900 mb-8">
          Avis des lecteurs <span className="text-ink-400 font-normal text-xl">({reviews.length})</span>
        </h2>

        {/* Add review */}
        {user && (
          <div className="bg-parchment rounded-xl p-6 mb-8">
            <h3 className="font-medium text-ink-900 mb-4">Laisser un avis</h3>
            <div className="mb-4">
              <p className="text-sm text-ink-500 mb-2">Note</p>
              <StarRating rating={reviewForm.rating} size={24} interactive onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
              placeholder="Votre commentaire (optionnel)"
              rows={3}
              className="input resize-none mb-4"
            />
            <button onClick={handleSubmitReview} disabled={submittingReview} className="btn-primary">
              {submittingReview ? <Spinner size="sm" /> : null}
              Publier l'avis
            </button>
          </div>
        )}

        {/* Reviews list */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-ink-400 text-sm">Aucun avis pour ce livre. Soyez le premier !</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-ink-100 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-ink-900 text-sm">{review.user.name}</p>
                    <StarRating rating={review.rating} size={14} />
                  </div>
                  <p className="text-xs text-ink-400">{formatDate(review.createdAt)}</p>
                </div>
                {review.comment && <p className="text-sm text-ink-600 mt-2 leading-relaxed">{review.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
