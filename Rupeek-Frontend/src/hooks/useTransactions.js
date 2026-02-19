import { useState, useEffect } from 'react';
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getAggregateFromServer,
    sum
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { startOfMonth, endOfMonth, parseISO } from 'date-fns';

export function useTransactions() {
    const { currentUser, userProfile } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        async function fetchBalance() {
            try {
                const coll = collection(db, 'users', currentUser.uid, 'transactions');
                const snapshot = await getAggregateFromServer(coll, {
                    totalIncome: sum('amount', where('type', '==', 'income')),
                    totalExpense: sum('amount', where('type', '==', 'expense'))
                });


                const incomeQuery = query(coll, where('type', '==', 'income'));
                const expenseQuery = query(coll, where('type', '==', 'expense'));

                const incomeSnap = await getAggregateFromServer(incomeQuery, { total: sum('amount') });
                const expenseSnap = await getAggregateFromServer(expenseQuery, { total: sum('amount') });

                const income = incomeSnap.data().total || 0;
                const expense = expenseSnap.data().total || 0;

                setTotalBalance(income - expense);
            } catch (err) {
                console.error("Error fetching balance:", err);
                setError(err);
            }
        }

        fetchBalance();
    }, [currentUser, transactions]);

    useEffect(() => {
        if (!currentUser) {
            setTransactions([]);
            setLoading(false);
            return;
        }

        const now = new Date();
        const salaryDate = userProfile?.salaryDate || 1;
        let start, end;

        if (salaryDate === 1) {
            start = startOfMonth(now);
            end = endOfMonth(now);
        } else {
            if (now.getDate() >= salaryDate) {
                start = new Date(now.getFullYear(), now.getMonth(), salaryDate);
                end = new Date(now.getFullYear(), now.getMonth() + 1, salaryDate - 1, 23, 59, 59);
            } else {
                start = new Date(now.getFullYear(), now.getMonth() - 1, salaryDate);
                end = new Date(now.getFullYear(), now.getMonth(), salaryDate - 1, 23, 59, 59);
            }
        }

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
    }, [currentUser, userProfile]);

    const addTransaction = async (transaction) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
                ...transaction,
                amount: parseFloat(transaction.amount),
                date: new Date(transaction.date), createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Error adding transaction:", err);
            throw err;
        }
    };

    return { transactions, totalBalance, loading, error, addTransaction };
}
