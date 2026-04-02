import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { User } from '../../types';

// ─── State ────────────────────────────────────────────────────────────────────
// Tokens are NO LONGER stored in state or localStorage.
// They live exclusively in httpOnly cookies managed by the browser.
// Only the user object is kept in memory (populated via /auth/me on init).
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean; // true once /me has been attempted on app load
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

/** Called once on app startup to restore session from cookie */
export const initAuthThunk = createAsyncThunk('auth/init', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.me();
    return data.data as User;
  } catch {
    return rejectWithValue(null); // No session — not an error worth displaying
  }
});

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (body: { email: string; name: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(body);
      return data.data.user as User;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (body: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(body);
      return data.data.user as User;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Init ──
    builder
      .addCase(initAuthThunk.pending, (state) => { state.loading = true; })
      .addCase(initAuthThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(initAuthThunk.rejected, (state) => {
        state.loading = false;
        state.initialized = true; // still initialized — just not logged in
      });

    // ── Register ──
    builder
      .addCase(registerThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Login ──
    builder
      .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Logout ──
    builder
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state) => {
        // Even if API call fails, clear local state
        state.user = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
