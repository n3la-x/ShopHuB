import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart', { product_id: productId, quantity });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue }) => {
  try {
    await api.delete(`/cart/${itemId}`);
    return itemId;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearCart: (state) => { state.items = []; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (s, a) => { s.items = a.payload?.items || []; })
      .addCase(addToCart.fulfilled, (s, a) => { s.items = a.payload?.items || []; })
      .addCase(removeFromCart.fulfilled, (s, a) => { s.items = s.items.filter(i => i.id !== a.payload); });
  }
});

export const { clearCart } = cartSlice.actions;
export const selectCartTotal = (state) => state.cart.items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export default cartSlice.reducer;
