import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { booksApi } from '../../api/booksApi';
import { authorsApi } from '../../api/authorsApi';
import { ordersApi } from '../../api/ordersApi';
import { Spinner } from '../../components/ui/Spinner';
import { formatPrice, getOrderStatusLabel, getOrderStatusColor, formatDate } from '../../utils/helpers';
import { Order } from '../../types';

export function AdminDashboard() {
  const [stats, setStats] = useState({ books: 0, authors: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      booksApi.getAll({ limit: 1 }),
      authorsApi.getAll({ limit: 1 }),
      ordersApi.getAllOrders({ limit: 5 }),
    ]).then(([booksRes, authorsRes, ordersRes]) => {
      const orders = ordersRes.data.data;
      const revenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
      setStats({
        books: booksRes.data.meta?.total || 0,
        authors: authorsRes.data.meta?.total || 0,
        orders: ordersRes.data.meta?.total || 0,
        revenue,
      });
      setRecentOrders(orders);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Livres', value: stats.books, icon: <BookOpen size={22} />, link: '/admin/books', color: 'bg-blue-50 text-blue-600' },
    { label: 'Auteurs', value: stats.authors, icon: <Users size={22} />, link: '/admin/authors', color: 'bg-purple-50 text-purple-600' },
    { label: 'Commandes', value: stats.orders, icon: <ShoppingBag size={22} />, link: '/admin/orders', color: 'bg-green-50 text-green-600' },
    { label: 'Revenu total', value: formatPrice(stats.revenue), icon: <TrendingUp size={22} />, link: '/admin/orders', color: 'bg-gold-light text-ink-700' },
  ];

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900 mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <Link key={s.label} to={s.link} className="card p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="text-xs text-ink-400 font-medium mb-1">{s.label}</p>
            <p className="font-display text-2xl font-bold text-ink-900">{s.value}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">Commandes récentes</h2>
          <Link to="/admin/orders" className="text-sm text-ink-500 hover:text-ink-900 transition-colors">Voir tout →</Link>
        </div>
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-parchment/50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs font-medium text-ink-900">
                    <Link to={`/orders/${order.id}`} className="hover:underline">{order.reference}</Link>
                  </td>
                  <td className="px-5 py-3 text-ink-600 hidden md:table-cell">{order.user?.name}</td>
                  <td className="px-5 py-3 text-ink-400 hidden sm:table-cell">{formatDate(order.createdAt)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                  </td>
                  <td className="px-5 py-3 text-right font-semibold text-ink-900">{formatPrice(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
