import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const StoreDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/stores/dashboard/");
        setDashboardData(response.data);
      } catch (err) {
        console.log(err.response.data.error);
        setError(err.response.data.error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="text-soft-gray font-inter text-center">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 font-inter text-center">{error}</p>;

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl text-forest mb-8 text-center">Store Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-all hover:shadow-lg">
          <h2 className="text-lg font-semibold text-forest font-inter">Total Orders</h2>
          <p className="text-3xl text-burnt-orange font-inter my-2">{dashboardData.total_orders}</p>
          <Link
            to="/store/orders"
            className="bg-forest text-white px-4 py-1 rounded-md hover:bg-burnt-orange transition-colors font-inter"
          >
            View Orders
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-all hover:shadow-lg">
          <h2 className="text-lg font-semibold text-forest font-inter">Total Earnings</h2>
          <p className="text-3xl text-burnt-orange font-inter my-2">${dashboardData.total_earnings}</p>
          <Link
            to="/store/transactions"
            className="bg-forest text-white px-4 py-1 rounded-md hover:bg-burnt-orange transition-colors font-inter"
          >
            View Transactions
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center transition-all hover:shadow-lg">
          <h2 className="text-lg font-semibold text-forest font-inter">Books in Stock</h2>
          <p className="text-3xl text-burnt-orange font-inter my-2">{dashboardData.total_books || "N/A"}</p>
          <Link
            to="/store/books"
            className="bg-forest text-white px-4 py-1 rounded-md hover:bg-burnt-orange transition-colors font-inter"
          >
            View Books
          </Link>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Books */}
        <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Low Stock Books</h2>
          {dashboardData.low_stock_books.length === 0 ? (
            <p className="text-soft-gray font-inter">No low stock books.</p>
          ) : (
            <ul className="space-y-2">
              {dashboardData.low_stock_books.map((book, index) => (
                <li key={index} className="text-soft-gray font-inter">
                  <span className="text-forest">{book.title}</span> - {book.stock_quantity} left
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Recent Orders</h2>
          {dashboardData.recent_orders.length === 0 ? (
            <p className="text-soft-gray font-inter">No recent orders.</p>
          ) : (
            <ul className="space-y-2">
              {dashboardData.recent_orders.map((order) => (
                <li key={order.id} className="text-soft-gray font-inter">
                  Order #{order.id} - <span className="text-burnt-orange">${order.total_price}</span> - {order.order_status}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Books */}
        <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Recent Books</h2>
          {dashboardData.recent_books.length === 0 ? (
            <p className="text-soft-gray font-inter">No recent books.</p>
          ) : (
            <ul className="space-y-2">
              {dashboardData.recent_books.map((book) => (
                <li key={book.id} className="text-soft-gray font-inter">
                  <span className="text-forest">{book.title}</span> - <span className="text-burnt-orange">${book.price}</span> - {book.stock_quantity} in stock
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white shadow-md rounded-lg p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Recent Transactions</h2>
          {dashboardData.recent_transactions.length === 0 ? (
            <p className="text-soft-gray font-inter">No recent transactions.</p>
          ) : (
            <ul className="space-y-2">
              {dashboardData.recent_transactions.map((transaction) => (
                <li key={transaction.id} className="text-soft-gray font-inter">
                  <span className="text-burnt-orange">${transaction.amount}</span> - {transaction.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;