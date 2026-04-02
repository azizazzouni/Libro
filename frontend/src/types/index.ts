export interface User {
  id: number;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  photoUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  children?: Category[];
}

export interface Book {
  id: number;
  title: string;
  slug: string;
  description?: string;
  isbn?: string;
  price: number;
  stock: number;
  coverUrl?: string;
  publishedAt?: string;
  language: string;
  pages?: number;
  isActive: boolean;
  author: Pick<Author, 'id' | 'name' | 'slug'>;
  categories: { category: Pick<Category, 'id' | 'name' | 'slug'> }[];
  reviews: { rating: number }[];
}

export interface CartItem {
  id: number;
  quantity: number;
  bookId: number;
  book: {
    id: number;
    title: string;
    price: number;
    coverUrl?: string;
    stock: number;
  };
}

export interface Order {
  id: number;
  reference: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  notes?: string;
  createdAt: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  items: {
    id: number;
    quantity: number;
    unitPrice: number;
    book: { id: number; title: string; coverUrl?: string };
  }[];
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: { id: number; name: string };
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type OrderStatus = Order['status'];
