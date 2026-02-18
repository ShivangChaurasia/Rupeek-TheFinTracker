import { useState, useEffect } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

// 1. Receive onSuccess prop
export default function TransactionForm({ uid, onSuccess }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const { addDocument, response } = useFirestore('transactions');

  const handleSubmit = (e) => {
    e.preventDefault();
    addDocument({
      uid, 
      name, 
      amount,
      date: new Date().toISOString().split('T')[0]
    });
  };

  // 2. THIS FIXES THE RED ERROR
  // Instead of setting state (which causes re-renders), we just call the parent function
  useEffect(() => {
    if (response.success) {
      onSuccess(); // The parent (Dashboard) will now reset the form for us
    }
  }, [response.success, onSuccess]);

  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 mb-4">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Transaction Name:</span>
          <input
            type="text"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </label>
        
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Amount ($):</span>
          <input
            type="number"
            required
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
          />
        </label>

        <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
          Add Transaction
        </button>
      </form>
    </>
  );
}