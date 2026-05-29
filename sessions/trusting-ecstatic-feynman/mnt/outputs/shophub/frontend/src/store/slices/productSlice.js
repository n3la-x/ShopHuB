import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], total: 0, page: 1, totalPages: 1, loading: false, filters: {} },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload }; },
    clearFilters: (state) => { state.filters = {}; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.products;
        s.total = a.payload.total;
        s.page = a.payload.page;
        s.totalPages = a.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (s) => { s.loading = false; });
  }
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
