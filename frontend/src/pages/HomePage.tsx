import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Truck, Shield, Star } from 'lucide-react';
import { booksApi } from '../api/booksApi';
import { Book } from '../types';
import { BookCard } from '../components/book/BookCard';
import { Spinner } from '../components/ui/Spinner';

export function HomePage() {
  const [featured, setFeatured] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    booksApi.getAll({ limit: 8 }).then(({ data }) => {
      setFeatured(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Star size={14} className="text-gold fill-gold" />
              <span className="text-ink-200">Des milliers de livres disponibles</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Votre prochaine<br />
              <span className="text-gold">grande lecture</span><br />
              vous attend.
            </h1>
            <p className="text-ink-300 text-lg mb-10 leading-relaxed">
              Explorez notre catalogue de livres soigneusement sélectionnés. Fiction, essais, classiques — il y en a pour tous les goûts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalogue" className="btn-gold px-8 py-3 text-base">
                Explorer le catalogue <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors text-base">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-parchment border-y border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: <Truck size={20} />, title: 'Livraison rapide', desc: 'Expédition sous 24h ouvrées' },
              { icon: <BookOpen size={20} />, title: 'Catalogue immense', desc: 'Des milliers de titres disponibles' },
              { icon: <Shield size={20} />, title: 'Paiement sécurisé', desc: 'Vos données sont protégées' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-ink-900 rounded-lg flex items-center justify-center text-cream flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-medium text-ink-900 mb-0.5">{f.title}</h3>
                  <p className="text-sm text-ink-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm text-gold font-medium mb-1">Sélection du moment</p>
            <h2 className="font-display text-3xl font-semibold text-ink-900">Nouveautés & Coups de cœur</h2>
          </div>
          <Link to="/catalogue" className="btn-secondary hidden sm:flex">
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        )}
        <div className="text-center mt-10 sm:hidden">
          <Link to="/catalogue" className="btn-secondary">Voir tout le catalogue</Link>
        </div>
      </section>
    </div>
  );
}
