import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import { ordersApi } from '../api/ordersApi';
import { Order } from '../types';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../utils/helpers';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersApi.getById(Number(id))
      .then(({ data }) => { setOrder(data.data); setLoading(false); })
      .catch(() => navigate('/profile'));
  }, [id, navigate]);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Spinner size="lg" /></div>;
  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 mb-8 transition-colors">
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink-900 mb-1">Commande</h1>
            <p className="font-mono text-sm text-ink-500">{order.reference}</p>
          </div>
          <span className={`badge text-sm px-3 py-1.5 ${getOrderStatusColor(order.status)}`}>
            {getOrderStatusLabel(order.status)}
          </span>
        </div>
        <p className="text-sm text-ink-400">Passée le {formatDate(order.createdAt)}</p>
        {order.notes && <p className="text-sm text-ink-600 mt-2 italic">Note : {order.notes}</p>}
      </div>

      <div className="card overflow-hidden mb-6">
        <div className="border-b border-ink-100 px-6 py-4">
          <h2 className="font-medium text-ink-900 flex items-center gap-2"><Package size={16} /> Articles commandés</h2>
        </div>
        <div className="divide-y divide-ink-50">
          {order.items.map((item) => (
            <div key={item.id} className="px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-16 bg-parchment rounded-lg overflow-hidden flex-shrink-0">
                {item.book.coverUrl ? (
                  <img src={item.book.coverUrl} alt={item.book.title} className="w-full h-full object-cover" />
                ) : <div className="w-full h-full flex items-center justify-center text-ink-300 text-lg">📖</div>}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink-900 text-sm">{item.book.title}</p>
                <p className="text-xs text-ink-400">Qté : {item.quantity} × {formatPrice(item.unitPrice)}</p>
              </div>
              <p className="font-semibold text-ink-900">{formatPrice(item.quantity * item.unitPrice)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100 px-6 py-4 flex justify-between">
          <span className="font-semibold text-ink-900">Total</span>
          <span className="font-display text-xl font-bold text-ink-900">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div className="text-center">
        <Link to="/catalogue" className="btn-secondary">Continuer mes achats</Link>
      </div>
    </div>
  );
}
