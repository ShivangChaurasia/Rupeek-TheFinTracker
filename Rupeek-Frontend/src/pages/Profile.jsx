import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { User, Mail, DollarSign, Wallet } from 'lucide-react';

export default function Profile() {
    const { currentUser, updateUserPassword, reauthenticate, deleteUserAccount } = useAuth();
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

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);



    useEffect(() => {
        if (currentUser) {
            const isGoogle = currentUser.providerData.some(
                (provider) => provider.providerId === 'google.com'
            );
            setIsGoogleUser(isGoogle);
        }
    }, [currentUser]);

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

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        setPasswordLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("New passwords do not match");
            setPasswordLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            setPasswordLoading(false);
            return;
        }

        try {
            if (!isGoogleUser) {
                await reauthenticate(passwordData.currentPassword);
            }
            await updateUserPassword(passwordData.newPassword);
            setPasswordSuccess("Password updated successfully");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordSection(false);
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordError("Failed to update password. Please check your current password and try again.");
        }
        setPasswordLoading(false);
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);



    // ... (existing useEffects) ...

    const handleDeleteAccount = async () => {
        setDeleteError('');
        setDeleteLoading(true);
        try {
            await deleteUserAccount(deletePassword);
            // AuthContext handles redirect usually via onAuthStateChanged, but we might want to force it or show success
        } catch (error) {
            console.error("Error deleting account:", error);
            setDeleteError("Failed to delete account. Please check your password and try again.");
            setDeleteLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your personal information and preferences
                </p>
            </div>

            {/* Profile Form */}
            <div className="max-w-2xl bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (existing profile form fields) ... */}
                    <div className="flex items-center gap-4 pb-6 border-b border-border">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{profile.name || 'User'}</h2>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                            {isGoogleUser && (
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mt-1">
                                    Google Account
                                </span>
                            )}
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

            {/* Password Management Section */}
            <div className="max-w-2xl bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">Password & Security</h2>
                        <p className="text-sm text-muted-foreground">
                            {isGoogleUser
                                ? "Set a password to login with email/password"
                                : "Update your account password"}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                    >
                        {showPasswordSection ? 'Cancel' : (isGoogleUser ? 'Set Password' : 'Change Password')}
                    </Button>
                </div>

                {showPasswordSection && (
                    <form onSubmit={handlePasswordUpdate} className="mt-6 space-y-4 animate-in slide-in-from-top-2">
                        {passwordError && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg">
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-3 rounded-lg text-sm">
                                {passwordSuccess}
                            </div>
                        )}

                        {!isGoogleUser && (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Current Password</label>
                                <Input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">New Password</label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <Input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                required
                                minLength={6}
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={passwordLoading}>
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>

            {/* Danger Zone */}
            <div className="max-w-2xl bg-destructive/5 rounded-xl border border-destructive/20 shadow-sm p-6 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
                        <p className="text-sm text-destructive/80">
                            Permanently delete your account and all data
                        </p>
                    </div>
                    {!showDeleteConfirm ? (
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            Delete Account
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                setDeleteError('');
                                setDeletePassword('');
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                </div>

                {showDeleteConfirm && (
                    <div className="mt-6 space-y-4 animate-in slide-in-from-top-2">
                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg border border-destructive/20">
                            <strong>Warning:</strong> This action is irreversible. All your data including transactions and personal information will be permanently deleted.
                        </div>

                        {deleteError && (
                            <div className="bg-destructive text-destructive-foreground text-sm p-3 rounded-lg">
                                {deleteError}
                            </div>
                        )}

                        {!isGoogleUser && (
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">
                                    Confirm with Password
                                </label>
                                <Input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Enter your current password"
                                    className="border-destructive/30 focus-visible:ring-destructive/30"
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                variant="destructive"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading || (!isGoogleUser && !deletePassword)}
                            >
                                {deleteLoading ? 'Deleting Account...' : 'Confirm Deletion'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
