import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Input from '../components/Input';
import Button from '../components/Button';
import { Wallet, CheckCircle2 } from 'lucide-react';

export default function Onboarding() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        monthlyIncome: '',
        currency: '₹',
    });

    const currencies = [
        { label: 'INR (₹)', value: '₹' },
        { label: 'USD ($)', value: '$' },
        { label: 'EUR (€)', value: '€' },
        { label: 'GBP (£)', value: '£' },
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setLoading(true);
            const userRef = doc(db, 'users', currentUser.uid);

            await setDoc(userRef, {
                name: formData.name,
                email: currentUser.email,
                monthlyIncome: parseFloat(formData.monthlyIncome),
                currency: formData.currency,
                isOnboarded: true,
                createdAt: serverTimestamp(),
                photoURL: currentUser.photoURL || '',
                provider: currentUser.providerData[0]?.providerId || 'email',
            });

            navigate('/');
        } catch (error) {
            console.error("Error saving profile:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-lg space-y-8 bg-card p-8 rounded-xl border border-border shadow-lg">
                <div className="flex flex-col items-center text-center">
                    <div className="bg-primary p-3 rounded-xl mb-4">
                        <Wallet className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">Let's set up your profile</h2>
                    <p className="text-muted-foreground mt-2">
                        Help us personalize your financial tracking experience
                    </p>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">What should we call you?</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    autoFocus
                                />
                            </div>
                            <Button type="button" className="w-full" onClick={() => setStep(2)} disabled={!formData.name}>
                                Continue
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select your currency</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {currencies.map((curr) => (
                                        <button
                                            key={curr.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, currency: curr.value })}
                                            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${formData.currency === curr.value
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'border-input hover:border-primary/50'
                                                }`}
                                        >
                                            <span className="font-medium">{curr.label}</span>
                                            {formData.currency === curr.value && (
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                    Back
                                </Button>
                                <Button type="button" onClick={() => setStep(3)} className="flex-1">
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">What is your monthly income?</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                                        {formData.currency}
                                    </span>
                                    <Input
                                        required
                                        type="number"
                                        className="pl-8"
                                        value={formData.monthlyIncome}
                                        onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    This helps us calculate your savings and budget.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                                    Back
                                </Button>
                                <Button type="submit" disabled={loading || !formData.monthlyIncome} className="flex-1">
                                    {loading ? 'Setting up...' : 'Complete Setup'}
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
