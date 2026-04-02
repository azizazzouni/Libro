import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginThunk, clearError } from '../store/slices/authSlice';
import { fetchCartThunk } from '../store/slices/cartSlice';
import { Spinner } from '../components/ui/Spinner';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    if (user) { dispatch(fetchCartThunk()); navigate('/'); }
    return () => { dispatch(clearError()); };
  }, [user, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const errors: FormErrors = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    dispatch(loginThunk(form));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-ink-900 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={22} className="text-cream" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink-900">Bon retour !</h1>
          <p className="text-ink-500 mt-1 text-sm">Connectez-vous à votre compte LibroStore</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={`input ${fieldErrors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                placeholder="vous@exemple.com"
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className={`input pr-10 ${fieldErrors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
              {loading ? <Spinner size="sm" /> : null}
              Se connecter
            </button>
          </form>
          <p className="text-center text-sm text-ink-500 mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-ink-900 font-medium hover:underline">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
