import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
// Import the context we just created
import { AuthContext } from './AuthContext'; 

export const AuthProvider = ({ children }) => {
  // ... same logic as before ...
  const [user, setUser] = useState(null);
  const [authIsReady, setAuthIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthIsReady(true);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, authIsReady }}>
      {authIsReady && children}
    </AuthContext.Provider>
  );
};