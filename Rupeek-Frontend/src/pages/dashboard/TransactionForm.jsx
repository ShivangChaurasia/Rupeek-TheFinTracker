import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

export default function TransactionForm({ uid, onSuccess }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const { addDocument, response } = useFirestore('transactions');

  const categories = ['General', 'Food', 'Rent', 'Shopping', 'Entertainment', 'Transport', 'Health'];

  const handleSubmit = (e) => {
    e.preventDefault();
    addDocument({
      uid,
      name,
      amount,
      category, date: new Date().toISOString().split('T')[0]
    });
  };

  useEffect(() => {
    if (response.success) {
      onSuccess();
    }
  }, [response.success, onSuccess]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-semibold text-gray-600">Transaction Name</span>
          <input
            type="text" required
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2 focus:ring-green-500 focus:border-green-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600">Amount ($)</span>
          <input
            type="number" required
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-600">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 p-2"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
          Add Transaction
        </button>
      </form>
    </div>
  );
}