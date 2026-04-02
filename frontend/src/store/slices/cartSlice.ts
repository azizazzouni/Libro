import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartApi } from '../../api/cartApi';
import { CartItem } from '../../types';

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchCartThunk = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.getCart();
    return data.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCartThunk = createAsyncThunk(
  'cart/add',
  async ({ bookId, quantity }: { bookId: number; quantity?: number }, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.addItem(bookId, quantity);
      dispatch(fetchCartThunk());
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const removeFromCartThunk = createAsyncThunk(
  'cart/remove',
  async (bookId: number, { dispatch, rejectWithValue }) => {
    try {
      await cartApi.removeItem(bookId);
      dispatch(fetchCartThunk());
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCartThunk = createAsyncThunk('cart/clear', async (_, { dispatch }) => {
  await cartApi.clearCart();
  dispatch(fetchCartThunk());
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart(state) {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartThunk.pending, (state) => { state.loading = true; })
      .addCase(fetchCartThunk.fulfilled, (state, action: PayloadAction<{ items: CartItem[]; total: number }>) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
