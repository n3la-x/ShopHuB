import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { selectCartCount } from '../../store/slices/cartSlice';
import NotificationBell from '../common/NotificationBell';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const cartCount = useSelector(selectCartCount);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">🛒 ShopHub</Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-blue-600 transition-colors">Products</Link>
          {isAuthenticated && user?.roles?.[0]?.name !== 'User' && (
            <Link to="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <span className="text-2xl">🛍️</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <NotificationBell />
              <div className="flex items-center gap-2">
                <Link to="/profile" className="text-sm font-medium text-gray-700">{user?.first_name}</Link>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-secondary text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
