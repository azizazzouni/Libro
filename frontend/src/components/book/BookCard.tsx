import { Link } from 'react-router-dom';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { Book } from '../../types';
import { StarRating } from '../ui/StarRating';
import { formatPrice, getAverageRating, truncate } from '../../utils/helpers';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addToCartThunk } from '../../store/slices/cartSlice';

interface Props { book: Book; }

export function BookCard({ book }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const avgRating = getAverageRating(book.reviews);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    dispatch(addToCartThunk({ bookId: book.id }));
  };

  return (
    <Link to={`/books/${book.slug}`} className="group card flex flex-col overflow-hidden">
      {/* Cover */}
      <div className="relative aspect-[3/4] bg-parchment overflow-hidden">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={40} className="text-ink-300" />
          </div>
        )}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-ink-900/60 flex items-center justify-center">
            <span className="text-white text-xs font-medium bg-ink-900 px-3 py-1 rounded-full">Rupture de stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-ink-400 font-medium mb-1">{book.author.name}</p>
        <h3 className="font-display font-semibold text-ink-900 leading-tight mb-2 line-clamp-2">
          {book.title}
        </h3>
        {book.description && (
          <p className="text-xs text-ink-500 mb-3 flex-1 line-clamp-2">{truncate(book.description, 80)}</p>
        )}
        <div className="flex items-center gap-1 mb-3">
          <StarRating rating={avgRating} size={13} />
          {book.reviews.length > 0 && (
            <span className="text-xs text-ink-400">({book.reviews.length})</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-display text-lg font-semibold text-ink-900">{formatPrice(book.price)}</span>
          {user && book.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-lg bg-ink-900 text-cream hover:bg-ink-700 transition-colors"
              title="Ajouter au panier"
            >
              <ShoppingCart size={15} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
