import { Link, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0 sticky top-0 h-screen">
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <Link
            to="/"
            className="block px-4 py-2 mb-4 text-center bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            🏠 Go to Main Page
          </Link>
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                📊 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                👤 Manage Users
              </Link>
            </li>
            <li>
              <Link
                to="/admin/stores"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🏬 Manage Stores
              </Link>
            </li>
            <li>
              <Link
                to="/admin/books"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                📚 Manage Books
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                📦 Manage Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/transactions"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                💰 Transactions
              </Link>
            </li>
            <li>
              <Link
                to="/admin/authors"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                📖 Authors
              </Link>
            </li>
            <li>
              <Link
                to="/admin/genres"
                className="block px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                🎭 Genres
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 mt-4 text-center bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;