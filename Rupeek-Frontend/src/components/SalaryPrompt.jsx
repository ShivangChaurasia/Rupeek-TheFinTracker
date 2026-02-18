import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../hooks/useTransactions';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Button from './Button';
import Input from './Input';
import { Wallet } from 'lucide-react';

export default function SalaryPrompt() {
    const { currentUser, userProfile } = useAuth();
    const { transactions } = useTransactions();
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userProfile || !transactions) return;

        // Check if we have a salary transaction for the current cycle
        // useTransactions already filters transactions for the current cycle!
        // So we just check if any "income" transaction exists in the list?
        // Or specifically "salary"?

        // User said: "ask user to tell them what is the earning of the month"
        // Let's assume if NO income transaction exists for this cycle, we prompt.
        // OR better: check for specific 'Salary' category to be less annoying if they added 'Gift'.

        const hasSalary = transactions.some(t => t.type === 'income' && t.category === 'Salary');

        if (!hasSalary) {
            // Check if today is past the salary date
            // Actually transactions are empty if new cycle started and no txn added.
            // But we need to make sure we don't prompt every time if they just haven't added it yet but don't want to.
            // Maybe check if we have already prompted? (Local storage? Or just rely on existence of txn?)
            // For now, prompt if missing.
            setIsOpen(true);

            // Pre-fill with profile income
            if (userProfile.monthlyIncome) {
                setAmount(userProfile.monthlyIncome.toString());
            }
        } else {
            setIsOpen(false);
        }
    }, [userProfile, transactions]);

    const handleConfirm = async () => {
        if (!amount || !currentUser) return;
        setLoading(true);
        try {
            // 1. Add Transaction
            await addDoc(collection(db, 'users', currentUser.uid, 'transactions'), {
                type: 'income',
                amount: parseFloat(amount),
                category: 'Salary',
                date: new Date(),
                note: 'Monthly Salary',
                createdAt: serverTimestamp()
            });

            // 2. Update Profile Monthly Income (in case it changed)
            if (parseFloat(amount) !== parseFloat(userProfile.monthlyIncome)) {
                await updateDoc(doc(db, 'users', currentUser.uid), {
                    monthlyIncome: parseFloat(amount)
                });
            }

            setIsOpen(false);
        } catch (error) {
            console.error("Error adding salary:", error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-lg space-y-4">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">New Cycle Started!</h2>
                        <p className="text-sm text-muted-foreground">
                            Time to record your monthly income.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Income Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">
                            {userProfile?.currency || '₹'}
                        </span>
                        <Input
                            type="number"
                            className="pl-8"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Skip
                    </Button>
                    <Button onClick={handleConfirm} disabled={loading || !amount}>
                        {loading ? 'Saving...' : 'Confirm Income'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
