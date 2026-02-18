import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  
  // Note: We don't need to manually dispatch to context 
  // because onAuthStateChanged in AuthContext handles the state update automatically.

  const signup = async (email, password, displayName, monthlyIncome) => {
    setError(null);
    setIsPending(true);

    try {
      // 1. Create User in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      // 2. Add Display Name to Auth Profile
      await updateProfile(res.user, { displayName });

      // 3. Create User Document in Firestore (As per your Schema)
      await setDoc(doc(db, 'users', res.user.uid), {
        name: displayName,
        email: email,
        monthlyIncome: Number(monthlyIncome), // Ensure number type
        currency: 'USD', // Default, or pass as arg
        createdAt: new Date(),
        isOnboarded: true, 
        photoURL: null
      });

      setIsPending(false);
      setError(null);
      
    } catch (err) {
      console.log(err.message);
      setError(err.message);
      setIsPending(false);
    }
  };

  return { signup, error, isPending };
};