import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';

export function useTransactions() {
    const { currentUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        // Default to current month
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());

        const q = query(
            collection(db, 'users', currentUser.uid, 'transactions'),
            where('date', '>=', start),
            where('date', '<=', end),
            orderBy('date', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Handle Firestore Timestamp to JS Date conversion
                date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date)
            }));
            setTransactions(data);
            setLoading(false);
        }, (err) => {
            console.error("Error fetching transactions:", err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const addTransaction = async (transaction) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
                ...transaction,
                amount: parseFloat(transaction.amount),
                date: new Date(transaction.date), // Ensure Date object
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Error adding transaction:", err);
            throw err;
        }
    };

    return { transactions, loading, error, addTransaction };
}
