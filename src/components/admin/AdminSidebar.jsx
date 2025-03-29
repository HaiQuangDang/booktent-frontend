
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">
            📊 Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-700">
            👤 Manage Users
          </Link>
        </li>
        <li>
          <Link to="/admin/stores" className="block px-4 py-2 rounded hover:bg-gray-700">
            🏬 Manage Stores
          </Link>
        </li>
        <li>
          <Link to="/admin/books" className="block px-4 py-2 rounded hover:bg-gray-700">
            📚 Manage Books
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="block px-4 py-2 rounded hover:bg-gray-700">
            📦 Manage Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/transactions" className="block px-4 py-2 rounded hover:bg-gray-700">
            💰 Transactions
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
