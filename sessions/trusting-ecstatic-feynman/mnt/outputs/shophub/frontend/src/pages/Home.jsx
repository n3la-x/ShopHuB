import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import Spinner from '../components/common/Spinner';

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sortBy: 'is_featured', sortOrder: 'DESC' }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-12 mb-10 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to ShopHub 🛒</h1>
        <p className="text-xl text-blue-100 mb-6">Discover amazing products at great prices</p>
        <Link to="/products" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors">
          Shop Now →
        </Link>
      </div>

      {/* Featured Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-8">
          <Link to="/products" className="btn-secondary">View All Products</Link>
        </div>
      </section>
    </div>
  );
}
