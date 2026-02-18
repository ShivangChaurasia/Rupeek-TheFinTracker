import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700">Email:</span>
          <input 
            type="email"
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        <label className="block mb-6">
          <span className="block text-sm font-medium text-gray-700">Password:</span>
          <input 
            type="password"
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </label>

        {!isPending && (
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
            Login
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