import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, DollarSign, Wallet } from 'lucide-react';

export default function Profile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        monthlyIncome: '',
        currency: '₹',
        salaryDate: 1
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            if (!currentUser) return;
            try {
                const docRef = doc(db, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile({
                        name: data.name || '',
                        email: currentUser.email || '',
                        monthlyIncome: data.monthlyIncome || '',
                        currency: data.currency || '₹',
                        salaryDate: data.salaryDate || 1
                    });
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
            setInitialLoading(false);
        }

        fetchProfile();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                name: profile.name,
                monthlyIncome: profile.monthlyIncome,
                currency: profile.currency,
                salaryDate: profile.salaryDate || 1
            });
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        setLoading(false);
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your personal information and preferences
                </p>
            </div>

            <div className="max-w-2xl bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-border">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{profile.name || 'User'}</h2>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </div>
                    </div>

                    {successMessage && (
                        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-3 rounded-lg text-sm">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                Full Name
                            </label>
                            <Input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Email
                            </label>
                            <Input
                                value={profile.email}
                                disabled
                                className="bg-muted opacity-50 cursor-not-allowed"
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-muted-foreground" />
                                    Monthly Income
                                </label>
                                <Input
                                    type="number"
                                    value={profile.monthlyIncome}
                                    onChange={(e) => setProfile({ ...profile, monthlyIncome: e.target.value })}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    Currency
                                </label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={profile.currency}
                                    onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
                                >
                                    <option value="₹">INR (₹)</option>
                                    <option value="$">USD ($)</option>
                                    <option value="€">EUR (€)</option>
                                    <option value="£">GBP (£)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Wallet className="w-4 h-4 text-muted-foreground" />
                                Salary Cycle Start Date
                            </label>
                            <Input
                                type="number"
                                min="1"
                                max="31"
                                value={profile.salaryDate}
                                onChange={(e) => setProfile({ ...profile, salaryDate: parseInt(e.target.value) })}
                                placeholder="1"
                            />
                            <p className="text-xs text-muted-foreground">
                                Your monthly budget will reset on this day.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
