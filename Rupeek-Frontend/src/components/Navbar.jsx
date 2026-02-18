import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white shadow-md mb-8">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo / Brand */}
        <Link to="/" className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span>💰</span>
          <span>FinTracker</span>
        </Link>

        {/* Links */}
        <ul className="flex items-center gap-6">
          
          {/* SHOW IF NOT LOGGED IN */}
          {!user && (
            <>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 font-medium transition">
                  Signup
                </Link>
              </li>
            </>
          )}

          {/* SHOW IF LOGGED IN */}
          {user && (
            <>
              <li className="text-gray-500 hidden sm:inline-block">
                Hello, {user.displayName || 'User'}
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-medium transition"
                >
                  Logout
                </button>
              </li>
            </>
          )}
          
        </ul>
      </div>
    </nav>
  );
}