import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks/redux';
import { initAuthThunk } from './store/slices/authSlice';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminLayout } from './pages/admin/AdminLayout';

import { HomePage } from './pages/HomePage';
import { CataloguePage } from './pages/CataloguePage';
import { BookDetailPage } from './pages/BookDetailPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { AuthorsPage } from './pages/AuthorsPage';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminAuthorsPage } from './pages/admin/AdminAuthorsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AuthorDetailPage } from './pages/AuthorDetailPage';

// ─── Inner component so it has access to Redux dispatch ───────────────────────
function AppRoutes() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // On mount, attempt to restore session from httpOnly cookie via /auth/me
    dispatch(initAuthThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with Navbar/Footer */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogue" element={<CataloguePage />} />
          <Route path="books/:slug" element={<BookDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="authors" element={<AuthorsPage />} />
          <Route path="authors/:id" element={<AuthorDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Protected: logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        {/* Admin: no Navbar/Footer, own layout */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="authors" element={<AdminAuthorsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
