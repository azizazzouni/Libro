import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, ShoppingBag, Tag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { to: '/admin', icon: <LayoutDashboard size={17} />, label: 'Dashboard', end: true },
  { to: '/admin/books', icon: <BookOpen size={17} />, label: 'Livres' },
  { to: '/admin/authors', icon: <Users size={17} />, label: 'Auteurs' },
  { to: '/admin/orders', icon: <ShoppingBag size={17} />, label: 'Commandes' },
  { to: '/admin/categories', icon: <Tag size={17} />, label: 'Catégories' },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-parchment">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-xl font-semibold text-ink-900">Administration</h1>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors">
            <ArrowLeft size={15} /> Retour au site
          </Link>
        </div>
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-52 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-ink-100 overflow-hidden">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-ink-50 last:border-0 transition-colors ${
                      isActive ? 'bg-ink-900 text-cream' : 'text-ink-600 hover:bg-parchment'
                    }`
                  }
                >
                  {item.icon} {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 bg-white rounded-xl border border-ink-100 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
