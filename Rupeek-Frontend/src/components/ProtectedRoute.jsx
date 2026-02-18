import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If user is logged in but not onboarded (or profil doesn't exist yet), and trying to access something other than onboarding
  if ((!userProfile || !userProfile.isOnboarded) && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // If user is onboarded and tries to access onboarding, redirect to dashboard
  if (userProfile && userProfile.isOnboarded && window.location.pathname === '/onboarding') {
    return <Navigate to="/" />;
  }

  return children;
}