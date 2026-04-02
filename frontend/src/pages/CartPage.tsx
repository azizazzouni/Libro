import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchCartThunk, addToCartThunk, removeFromCartThunk, clearCartThunk } from '../store/slices/cartSlice';
import { ordersApi } from '../api/ordersApi';
import { formatPrice } from '../utils/helpers';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { useState } from 'react';

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total, loading } = useAppSelector((s) => s.cart);
  const { user } = useAppSelector((s) => s.auth);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (user) dispatch(fetchCartThunk());
  }, [dispatch, user]);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const { data } = await ordersApi.checkout();
      dispatch(fetchCartThunk());
      navigate(`/orders/${data.data.id}`);
    } finally {
      setCheckingOut(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <EmptyState
          title="Connexion requise"
          description="Connectez-vous pour accéder à votre panier."
          action={<Link to="/login" className="btn-primary">Se connecter</Link>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink-900 mb-8">Mon panier</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Votre panier est vide"
          description="Explorez notre catalogue pour trouver votre prochaine lecture."
          icon={<ShoppingBag size={28} />}
          action={<Link to="/catalogue" className="btn-primary">Explorer le catalogue</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="card p-4 flex gap-4">
                <div className="w-16 h-20 bg-parchment rounded-lg overflow-hidden flex-shrink-0">
                  {item.book.coverUrl ? (
                    <img src={item.book.coverUrl} alt={item.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-300">📖</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-ink-900 truncate mb-1">{item.book.title}</h3>
                  <p className="text-sm text-ink-400 mb-3">{formatPrice(item.book.price)} / unité</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(addToCartThunk({ bookId: item.bookId, quantity: Math.max(1, item.quantity - 1) }))}
                      className="w-7 h-7 rounded-md border border-ink-200 flex items-center justify-center hover:bg-parchment transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(addToCartThunk({ bookId: item.bookId, quantity: item.quantity + 1 }))}
                      disabled={item.quantity >= item.book.stock}
                      className="w-7 h-7 rounded-md border border-ink-200 flex items-center justify-center hover:bg-parchment transition-colors disabled:opacity-40"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => dispatch(removeFromCartThunk(item.bookId))}
                    className="text-ink-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <p className="font-display font-semibold text-ink-900">{formatPrice(Number(item.book.price) * item.quantity)}</p>
                </div>
              </div>
            ))}

            <button
              onClick={() => dispatch(clearCartThunk())}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
            >
              <Trash2 size={14} /> Vider le panier
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-ink-900 mb-6">Récapitulatif</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="border-t border-ink-100 pt-3 flex justify-between">
                  <span className="font-semibold text-ink-900">Total</span>
                  <span className="font-display text-xl font-bold text-ink-900">{formatPrice(total)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={checkingOut} className="btn-primary w-full justify-center py-3 text-base">
                {checkingOut ? <Spinner size="sm" /> : <ArrowRight size={18} />}
                Commander
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
