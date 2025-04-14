import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [recentAuthors, setRecentAuthors] = useState(null);
  const [genreRequests, setGenreRequests] = useState(null);
  const [bookStats, setBookStats] = useState(null);
  const [topSellingData, setTopSellingData] = useState([]);
  const [bookSalesChartData, setBookSalesChartData] = useState([]);
  const [salesFilter, setSalesFilter] = useState("daily");
  const [earningsStats, setEarningsStats] = useState(null);
  const [earningsFilter, setEarningsFilter] = useState("weekly"); // Track selected earnings filter: 'weekly', 'monthly', 'yearly'


  useEffect(() => {
    fetchAdminStats();
    fetchRecentActivity();
    fetchRecentAuthors();
    fetchGenreRequests();
    fetchBookStats();
    fetchEarningsStats();
  }, []);

  const fetchBookStats = async () => {
    try {
      const res = await api.get("/admin/book-stats/");
      setBookStats(res.data);

      // Format Top Selling Books
      const formattedTopSelling = res.data.top_selling_books.map((book) => ({
        title: book.book__title,
        sold: book.sold,
      }));
      setTopSellingData(formattedTopSelling);

      // Format Book Sales Chart Data (Separate Breakdown for Daily, Monthly, and Yearly)
      setBookSalesChartData({
        daily: res.data.sales_stats.daily_breakdown,
        monthly: res.data.sales_stats.monthly_breakdown,
        yearly: res.data.sales_stats.yearly_breakdown,
      });
    } catch (error) {
      console.error("Error fetching book stats", error);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await api.get("/admin/stats/");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await api.get("/admin/recent-activity/");
      setRecentActivity(res.data);
    } catch (error) {
      console.error("Error fetching recent activity", error);
    }
  };

  const fetchEarningsStats = async () => {
    try {
      const res = await api.get("/admin/earnings/");
      setEarningsStats(res.data);
    } catch (error) {
      console.error("Error fetching earnings stats", error);
    }
  };


  const fetchRecentAuthors = async () => {
    try {
      const res = await api.get("/admin/recent-authors/");
      setRecentAuthors(res.data.recent_authors);
    } catch (error) {
      console.error("Error fetching recent authors", error);
    }
  };

  const fetchGenreRequests = async () => {
    try {
      const res = await api.get("/admin/recent-genre-requests/");
      setGenreRequests(res.data.genre_requests);
    } catch (error) {
      console.error("Error fetching genre requests", error);
    }
  };

  const getChartData = () => {
    switch (salesFilter) {
      case "daily":
        return bookSalesChartData.daily;
      case "monthly":
        return bookSalesChartData.monthly;
      case "yearly":
        return bookSalesChartData.yearly;
      default:
        return [];
    }
  };

  const getEarningsData = () => {
    switch (earningsFilter) {
      case "weekly":
        return earningsStats?.earnings_weekly || [];
      case "monthly":
        return earningsStats?.earnings_monthly || [];
      case "yearly":
        return earningsStats?.earnings_yearly || [];
      default:
        return [];
    }
  };


  if (!stats || !recentActivity || !earningsStats || !recentAuthors || !genreRequests || !bookStats)
    return <LoadingIndicator />;

  return (
    <div className="flex-1 p-6 bg-beige min-h-screen">
      <h1 className="text-4xl font-playfair text-forest mb-2">Admin Dashboard</h1>
      <p className="text-soft-gray font-inter mb-8">Overview of the platform</p>

      <div className="space-y-12">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Today Orders", value: stats.orders_today },
            { label: "Books Sold Today", value: stats.books_sold_today },
            { label: "Earnings Today", value: `$${stats.earnings_today.toFixed(2)}` },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <p className="text-2xl font-semibold text-burnt-orange font-inter">{card.value}</p>
              <p className="text-sm text-forest font-inter mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-inter text-forest mb-3">Pending Stores</h3>
              {recentActivity.pending_stores.length > 0 ? (
                <ul className="space-y-3 text-sm text-soft-gray font-inter">
                  {recentActivity.pending_stores.map((store) => (
                    <li key={store.id} className="border-b border-soft-gray/30 py-2">
                      <span className="font-medium text-forest">{store.name}</span> – {store.owner__username}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-soft-gray font-inter">No pending stores</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-inter text-forest mb-3">Pending Books</h3>
              {recentActivity.pending_books.length > 0 ? (
                <ul className="space-y-3 text-sm text-soft-gray font-inter">
                  {recentActivity.pending_books.map((book) => (
                    <li key={book.id} className="border-b border-soft-gray/30 py-2">
                      <span className="font-medium text-forest">{book.title}</span> – {book.store__name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-soft-gray font-inter">No pending books</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-inter text-forest mb-3">Recent Orders</h3>
              {recentActivity.recent_orders.length > 0 ? (
                <ul className="space-y-3 text-sm text-soft-gray font-inter">
                  {recentActivity.recent_orders.map((order) => (
                    <li key={order.id} className="border-b border-soft-gray/30 py-2">
                      {order.user__username} –{" "}
                      <span className="text-burnt-orange font-semibold">${order.total_price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-soft-gray font-inter">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Authors */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Recent Authors (Last 7 Days)</h2>
          {!recentAuthors.length ? (
            <p className="text-soft-gray font-inter">No recent authors</p>
          ) : (
            <ul className="space-y-3 text-sm text-soft-gray font-inter">
              {recentAuthors.map((author) => (
                <li key={author.id} className="border-b border-soft-gray/30 py-2">
                  <Link
                    to={`/author/${author.id}`}
                    className="font-medium text-forest hover:text-burnt-orange transition-colors"
                  >
                    {author.name}
                  </Link>{" "}
                  – {new Date(author.created_at).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Genre Requests */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Genre Requests</h2>
          {!genreRequests.length ? (
            <p className="text-soft-gray font-inter">No genre requests</p>
          ) : (
            <ul className="space-y-3 text-sm text-soft-gray font-inter">
              {genreRequests.map((request) => (
                <li key={request.id} className="border-b border-soft-gray/30 py-2">
                  <span className="font-medium text-forest">{request.name}</span> – {request.status} – Requested by{" "}
                  {request.requested_by__username}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Book Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Book Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <p className="text-2xl font-semibold text-burnt-orange font-inter">{bookStats.sales_stats.daily_sales}</p>
              <p className="text-sm text-forest font-inter">Books Sold Today</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-burnt-orange font-inter">{bookStats.sales_stats.monthly_sales}</p>
              <p className="text-sm text-forest font-inter">Books Sold This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-burnt-orange font-inter">{bookStats.sales_stats.yearly_sales}</p>
              <p className="text-sm text-forest font-inter">Books Sold This Year</p>
            </div>
          </div>

          <h3 className="text-xl font-playfair text-forest mb-4">Top 10 Best-Selling Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingData} layout="vertical" margin={{ left: 150, right: 20, top: 20, bottom: 20 }}>
              <XAxis type="number" stroke="#4b5e40" fontFamily="Inter" fontSize={12} />
              <YAxis
                dataKey="title"
                type="category"
                stroke="#4b5e40"
                fontFamily="Inter"
                fontSize={12}
                width={140}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontFamily: "Inter",
                  color: "#4b5e40",
                }}
              />
              <Bar dataKey="sold" fill="#d97706" radius={[4, 4, 4, 4]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex justify-start gap-2 mt-8 mb-4">
            {["daily", "monthly", "yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSalesFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-inter ${salesFilter === filter
                    ? "bg-forest text-white"
                    : "bg-soft-gray text-forest hover:bg-gray-300"
                  } transition-colors`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-playfair text-forest mb-4">
            Book Sales by {salesFilter.charAt(0).toUpperCase() + salesFilter.slice(1)}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getChartData()} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                dataKey={salesFilter === "daily" ? "day" : salesFilter === "monthly" ? "month" : "year"}
                stroke="#4b5e40"
                fontFamily="Inter"
                fontSize={12}
              />
              <YAxis stroke="#4b5e40" fontFamily="Inter" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontFamily: "Inter",
                  color: "#4b5e40",
                }}
              />
              <Bar dataKey="quantity" fill="#d97706" radius={[4, 4, 4, 4]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-start gap-2 mb-4">
            {["weekly", "monthly", "yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() => setEarningsFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-inter ${earningsFilter === filter
                    ? "bg-forest text-white"
                    : "bg-soft-gray text-forest hover:bg-gray-300"
                  } transition-colors`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <h3 className="text-xl font-playfair text-forest mb-4">
            Earnings by {earningsFilter.charAt(0).toUpperCase() + earningsFilter.slice(1)}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getEarningsData()} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                dataKey={earningsFilter === "weekly" ? "week" : earningsFilter === "monthly" ? "month" : "year"}
                stroke="#4b5e40"
                fontFamily="Inter"
                fontSize={12}
              />
              <YAxis
                stroke="#4b5e40"
                fontFamily="Inter"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => `$${value}`}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontFamily: "Inter",
                  color: "#4b5e40",
                }}
              />
              <Bar dataKey="earnings" fill="#d97706" radius={[4, 4, 4, 4]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
