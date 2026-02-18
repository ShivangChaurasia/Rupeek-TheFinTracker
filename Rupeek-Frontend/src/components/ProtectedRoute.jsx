import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { user, authIsReady } = useAuth();

  // 1. If Auth is still loading, show nothing (or a spinner)
  if (!authIsReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 2. If Auth is ready but no user found, kick them to Login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 3. If user is authenticated, let them see the page
  return children;
};