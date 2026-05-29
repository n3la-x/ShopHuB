import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const price = product.sale_price || product.price;
  const image = product.images?.[0]?.image_url || 'https://placehold.co/300x200?text=No+Image';

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/products/${product.id}`} className="card hover:shadow-md transition-shadow group">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img src={image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.sale_price && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">SALE</span>
        )}
      </div>
      <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{product.brand?.name}</p>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-blue-600">€{Number(price).toFixed(2)}</span>
          {product.sale_price && (
            <span className="ml-2 text-sm text-gray-400 line-through">€{Number(product.price).toFixed(2)}</span>
          )}
        </div>
        <button onClick={handleAddToCart} className="btn-primary text-sm py-1">Add to Cart</button>
      </div>
    </Link>
  );
}
