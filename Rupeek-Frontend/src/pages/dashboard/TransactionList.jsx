import { useFirestore } from '../../hooks/useFirestore';

export default function TransactionList({ transactions }) {
  const { deleteDocument } = useFirestore('transactions');

  // Helper function for category colors
  const getCategoryColor = (cat) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-700',
      Rent: 'bg-purple-100 text-purple-700',
      Shopping: 'bg-pink-100 text-pink-700',
      Transport: 'bg-blue-100 text-blue-700',
      General: 'bg-gray-100 text-gray-700'
    };
    return colors[cat] || 'bg-green-100 text-green-700';
  };

  return (
    <ul className="space-y-3">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center group">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-800">{transaction.name}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit mt-1 ${getCategoryColor(transaction.category)}`}>
              {transaction.category}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-xl font-extrabold text-gray-900">${Number(transaction.amount).toFixed(2)}</span>
            <button 
              onClick={() => deleteDocument(transaction.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-xl"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}