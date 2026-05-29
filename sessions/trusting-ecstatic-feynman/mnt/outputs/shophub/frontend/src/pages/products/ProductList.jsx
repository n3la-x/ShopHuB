import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setFilters } from '../../store/slices/productSlice';
import ProductCard from '../../components/products/ProductCard';
import Spinner from '../../components/common/Spinner';

export default function ProductList() {
  const dispatch = useDispatch();
  const { items, loading, total, totalPages, page, filters } = useSelector(s => s.products);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: 1 }));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search, minPrice, maxPrice, sortBy }));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchProducts({ ...filters, page: newPage }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* Advanced Search */}
      <form onSubmit={handleSearch} className="card mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-48">
          <label className="text-sm font-medium text-gray-700 block mb-1">Search</label>
          <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." />
        </div>
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700 block mb-1">Min Price €</label>
          <input className="input-field" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" />
        </div>
        <div className="w-32">
          <label className="text-sm font-medium text-gray-700 block mb-1">Max Price €</label>
          <input className="input-field" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="999" />
        </div>
        <div className="w-40">
          <label className="text-sm font-medium text-gray-700 block mb-1">Sort By</label>
          <select className="input-field" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="created_at">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">🔍 Search</button>
      </form>

      <p className="text-sm text-gray-500 mb-4">{total} products found</p>

      {loading ? <Spinner /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-lg ${p === page ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
