import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-display text-xl text-white">LibroStore</span>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed">
              Votre librairie en ligne. Des milliers de livres, livrés chez vous.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogue" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link to="/authors" className="hover:text-white transition-colors">Auteurs</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Panier</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Compte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Connexion</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Créer un compte</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Mon profil</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ink-800 mt-10 pt-6 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} LibroStore. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
