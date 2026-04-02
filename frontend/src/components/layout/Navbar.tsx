import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, BookOpen, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutThunk } from '../../store/slices/authSlice';

export function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { items } = useAppSelector((s) => s.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate('/');
  };

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-ink-900 rounded-lg flex items-center justify-center group-hover:bg-ink-700 transition-colors">
              <BookOpen size={16} className="text-cream" />
            </div>
            <span className="font-display text-xl font-semibold text-ink-900 hidden sm:block">LibroStore</span>
          </Link>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/catalogue" className="text-sm text-ink-600 hover:text-ink-900 font-medium transition-colors">Catalogue</Link>
            <Link to="/authors" className="text-sm text-ink-600 hover:text-ink-900 font-medium transition-colors">Auteurs</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-lg hover:bg-parchment transition-colors">
              <ShoppingCart size={20} className="text-ink-700" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalQty}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="p-2.5 rounded-lg hover:bg-parchment transition-colors" title="Admin">
                    <LayoutDashboard size={20} className="text-ink-700" />
                  </Link>
                )}
                <Link to="/profile" className="p-2.5 rounded-lg hover:bg-parchment transition-colors" title="Profil">
                  <User size={20} className="text-ink-700" />
                </Link>
                <button onClick={handleLogout} className="p-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Déconnexion">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Connexion</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">S'inscrire</Link>
              </div>
            )}

            {/* Mobile menu btn */}
            <button className="md:hidden p-2 rounded-lg hover:bg-parchment" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-100 bg-cream px-4 py-4 flex flex-col gap-3 animate-fade-in">
          <Link to="/catalogue" className="text-sm font-medium text-ink-700 py-2" onClick={() => setMenuOpen(false)}>Catalogue</Link>
          <Link to="/authors" className="text-sm font-medium text-ink-700 py-2" onClick={() => setMenuOpen(false)}>Auteurs</Link>
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-ink-700 py-2" onClick={() => setMenuOpen(false)}>Mon profil</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm font-medium text-ink-700 py-2" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="text-sm font-medium text-red-500 py-2 text-left">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-center" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link to="/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>S'inscrire</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
