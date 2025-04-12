import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const StoreDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [queryDate, setQueryDate] = useState("");


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, orderStatsRes] = await Promise.all([
          api.get("/stores/dashboard/"),
          api.get("/stores/dashboard/orders/")
        ]);
        setDashboardData(dashboardRes.data);
        setOrderStats(orderStatsRes.data);
      } catch (err) {
        console.log(err.response?.data?.error || err.message);
        setError(err.response?.data?.error || "Something went wrong");
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
      <h1 className="text-4xl text-forest mb-2 text-center">{dashboardData.store_name}</h1>
      <p className="text-soft-gray font-inter text-center mb-4">Status: <span className="text-forest">{dashboardData.store_status.toUpperCase()}</span></p>
      <p className="text-lg text-forest font-inter text-center mb-8">Welcome to your store dashboard!</p>

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
          <p className="text-3xl text-burnt-orange font-inter my-2">{dashboardData.total_books}</p>
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

        {orderStats && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Object.entries(orderStats.summary).map(([key, value]) => (
                <div key={key} className="bg-white shadow rounded-lg p-4 text-center">
                  <h3 className="text-sm text-soft-gray font-inter capitalize">{key.replace(/_/g, ' ')}</h3>
                  <p className="text-2xl text-burnt-orange font-bold">{value}</p>
                </div>
              ))}
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {Object.entries(orderStats.comparison).map(([key, data]) => (
                <div key={key} className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-sm text-soft-gray font-inter capitalize mb-1">{key.replace(/_/g, ' ')}</h3>
                  <p className="text-md font-inter">Current: <span className="text-forest">{data.current}</span></p>
                  <p className="text-md font-inter">Previous: <span className="text-forest">{data.previous}</span></p>
                  <p className="text-md font-inter">Change: <span className={data.change_percent > 0 ? "text-green-600" : "text-red-600"}>{data.change_percent}%</span></p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Orders Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orderStats.chart_data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#d97706" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Query Date Orders */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Check Orders on Specific Date</h2>
              <input
                type="date"
                value={queryDate}
                onChange={(e) => setQueryDate(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 mb-4 font-inter"
              />
              <button
                onClick={async () => {
                  try {
                    const res = await api.get("/stores/dashboard/orders/", {
                      params: { date: queryDate },
                    });
                    setOrderStats((prev) => ({
                      ...prev,
                      query_date_orders: res.data.query_date_orders,
                    }));
                  } catch (err) {
                    console.log("Failed to fetch query date orders");
                  }
                }}
                className="bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition"
              >
                Check
              </button>

              {orderStats.query_date_orders !== null && (
                <p className="mt-4 font-inter text-soft-gray">
                  Orders on <span className="text-forest font-medium">{queryDate}</span>:{" "}
                  <span className="text-burnt-orange font-semibold">{orderStats.query_date_orders}</span>
                </p>
              )}
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default StoreDashboard;