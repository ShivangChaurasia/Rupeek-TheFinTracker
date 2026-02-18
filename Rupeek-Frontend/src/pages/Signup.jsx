import { useState } from 'react';
import { useSignup } from '../hooks/useSignup';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the hook with the 4 fields required by your design
    signup(email, password, displayName, monthlyIncome);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Display Name:</span>
          <input 
            type="text"
            required
            onChange={(e) => setDisplayName(e.target.value)} 
            value={displayName}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Monthly Income ($):</span>
          <input 
            type="number"
            required
            onChange={(e) => setMonthlyIncome(e.target.value)} 
            value={monthlyIncome}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Email:</span>
          <input 
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="block text-sm font-medium text-gray-700">Password:</span>
          <input 
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {!isPending && (
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Sign Up
          </button>
        )}
        
        {isPending && (
          <button className="w-full bg-blue-300 text-white py-2 px-4 rounded" disabled>
            Loading...
          </button>
        )}

        {error && <div className="text-red-500 mt-4 text-sm text-center">{error}</div>}
      </form>
    </div>
  );
}