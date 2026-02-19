import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Input from './Input';

export default function AddTransactionModal({ isOpen, onClose, onAdd, onUpdate, initialData }) {
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type,
                amount: initialData.amount,
                category: initialData.category,
                note: initialData.note || '',
                date: initialData.date instanceof Date
                    ? initialData.date.toISOString().split('T')[0]
                    : new Date(initialData.date).toISOString().split('T')[0]
            });
        } else {
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                note: '',
                date: new Date().toISOString().split('T')[0]
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await onUpdate(initialData.id, formData);
            } else {
                await onAdd(formData);
            }
            onClose();
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="flex gap-2 p-1 bg-muted rounded-lg">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'income'
                                ? 'bg-green-100 text-green-700 shadow-sm border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'expense'
                                ? 'bg-red-100 text-red-700 shadow-sm border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`}
                            onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                        >
                            Expense
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Amount</label>
                        <Input
                            type="number"
                            required
                            min="0"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Input
                            required
                            placeholder="e.g. Food, Rent, Salary"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Note (Optional)</label>
                        <Input
                            placeholder="e.g. Lunch with team"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Transaction' : 'Add Transaction')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
