import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { Spinner } from '../ui/Spinner';

interface Props {
  adminOnly?: boolean;
}

export function ProtectedRoute({ adminOnly = false }: Props) {
  const { user, initialized } = useAppSelector((s) => s.auth);

  // Wait for /me check to complete before redirecting
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return <Outlet />;
}
