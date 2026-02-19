import { useState } from 'react';
import { auth, db } from '../firebase/config';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);


  const signup = async (email, password, displayName, monthlyIncome) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res) {
        throw new Error('Could not complete signup');
      }

      await updateProfile(res.user, { displayName });

      await setDoc(doc(db, 'users', res.user.uid), {
        name: displayName,
        email: email,
        monthlyIncome: Number(monthlyIncome), currency: 'USD', createdAt: new Date(),
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