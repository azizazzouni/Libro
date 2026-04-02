import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { Order, OrderStatus } from '../../types';
import { Spinner } from '../../components/ui/Spinner';
import { Pagination } from '../../components/ui/Pagination';
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '../../utils/helpers';

const STATUSES: { value: OrderStatus | ''; label: string }[] = [
  { value: '', label: 'Toutes' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'CONFIRMED', label: 'Confirmées' },
  { value: 'SHIPPED', label: 'Expédiées' },
  { value: 'DELIVERED', label: 'Livrées' },
  { value: 'CANCELLED', label: 'Annulées' },
];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ordersApi.getAllOrders({ page, limit: 15, status: status || undefined }).then(({ data }) => {
      setOrders(data.data);
      setTotal(data.meta?.total || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page, status]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    await ordersApi.updateStatus(orderId, newStatus);
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-6">Commandes</h1>

      <div className="flex gap-2 mb-5 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setStatus(s.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === s.value ? 'bg-ink-900 text-cream' : 'bg-white border border-ink-200 text-ink-600 hover:bg-parchment'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-parchment text-ink-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Référence</th>
                  <th className="px-5 py-3 text-left hidden md:table-cell">Client</th>
                  <th className="px-5 py-3 text-left hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-parchment/50">
                    <td className="px-5 py-3 font-mono text-xs font-medium">
                      <Link to={`/orders/${order.id}`} className="hover:underline text-ink-900">{order.reference}</Link>
                    </td>
                    <td className="px-5 py-3 text-ink-600 hidden md:table-cell">{order.user?.name}</td>
                    <td className="px-5 py-3 text-ink-400 hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer ${getOrderStatusColor(order.status)}`}
                      >
                        {STATUSES.filter(s => s.value).map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">{formatPrice(order.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={Math.ceil(total / 15)} onChange={setPage} />
        </>
      )}
    </div>
  );
}
