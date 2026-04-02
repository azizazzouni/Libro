import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../hooks/redux';
import { ordersApi } from '../api/ordersApi';
import { Order } from '../types';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../utils/helpers';

export function ProfilePage() {
  const { user } = useAppSelector((s) => s.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi.getMyOrders({ limit: 10 })
      .then(({ data }) => { setOrders(data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="card p-6 mb-8 flex items-center gap-5">
        <div className="w-16 h-16 bg-ink-900 rounded-full flex items-center justify-center flex-shrink-0">
          <User size={28} className="text-cream" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{user.name}</h1>
          <p className="text-ink-500 text-sm">{user.email}</p>
          {user.role === 'ADMIN' && (
            <span className="inline-flex items-center mt-1.5 text-xs font-medium text-gold bg-gold-light px-2.5 py-0.5 rounded-full">
              Administrateur
            </span>
          )}
        </div>
      </div>

      {/* Orders */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-semibold text-ink-900 flex items-center gap-2">
            <Package size={20} className="text-ink-400" /> Mes commandes
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="Aucune commande"
            description="Vous n'avez pas encore passé de commande."
            icon={<Package size={28} />}
            action={<Link to="/catalogue" className="btn-primary">Découvrir le catalogue</Link>}
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-sm font-medium text-ink-900">{order.reference}</span>
                    <span className={`badge ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                  </div>
                  <p className="text-xs text-ink-400">
                    {formatDate(order.createdAt)} · {order.items.length} article{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-display font-semibold text-ink-900">{formatPrice(order.totalAmount)}</span>
                  <ChevronRight size={16} className="text-ink-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
