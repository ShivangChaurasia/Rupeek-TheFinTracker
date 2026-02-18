import { useAuth } from '../context/useAuth';
import { useState } from 'react';

import TransactionForm from './dashboard/TransactionForm'; 

export default function Dashboard() {
  const { user } = useAuth();
  const [formKey, setFormKey] = useState(0);

  // This function forces the form to destroy and recreate itself
  const resetForm = () => setFormKey(prev => prev + 1);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-md min-h-[300px]">
          <p className="text-gray-500 text-center mt-20">Transaction List (Coming Soon...)</p>
        </div>
      </div>
      
      <div className="md:col-span-1">
        {/* Pass the resetForm function as 'onSuccess' */}
        <TransactionForm key={formKey} uid={user.uid} onSuccess={resetForm} />
      </div>
    </div>
  );
}