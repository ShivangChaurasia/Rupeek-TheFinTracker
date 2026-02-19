import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if ((!userProfile || !userProfile.isOnboarded) && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  if (userProfile && userProfile.isOnboarded && window.location.pathname === '/onboarding') {
    return <Navigate to="/" />;
  }

  return children;
}