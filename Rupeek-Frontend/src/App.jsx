import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';

// Components
import Navbar from './components/Navbar'; // <-- IMPORT THIS
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <div className="App bg-gray-50 min-h-screen"> 
      <AuthProvider>
        <BrowserRouter>
          
          {/* NAVBAR GOES HERE (Visible on all pages) */}
          <Navbar />
          
          <div className="container mx-auto px-4"> {/* Container for page content */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

              {/* Protected Routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

// ... PublicRoute helper stays the same ...
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default App;