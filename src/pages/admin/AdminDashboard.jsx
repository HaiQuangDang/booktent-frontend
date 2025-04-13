import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  // const [earnings, setEarnings] = useState(null);
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
        total_sold: book.total_sold,
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
    return <p className="text-center text-forest font-inter">Loading...</p>;

  return (
    <div className="flex-1 p-6 bg-beige min-h-screen">
      <h1 className="text-3xl font-playfair text-forest mb-2">Admin Dashboard</h1>
      <p className="text-soft-gray font-inter mb-6">Overview of the platform</p>

      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Today Orders", value: stats.orders_today },
            { label: "Total Books", value: stats.books_sold_today },
            { label: "Total Earning", value: stats.earnings_today },
          ].map((card, idx) => (
            <div
              key={idx}
              className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl p-4"
            >
              <p className="text-xl font-semibold text-burnt-orange">{card.value}</p>
              <p className="text-sm text-forest font-inter">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pending Stores */}
            <div>
              <h3 className="text-lg font-inter text-forest mb-2">Pending Stores</h3>
              <ul className="space-y-2 text-sm text-soft-gray font-inter">
                {recentActivity.pending_stores.length > 0 ? (
                  recentActivity.pending_stores.map((store) => (
                    <li key={store.id} className="border-b border-soft-gray/50 py-1">
                      <span className="font-medium text-forest">{store.name}</span> – {store.owner__username}
                    </li>
                  ))
                ) : (
                  <li className="text-soft-gray">No pending stores</li>
                )}
              </ul>
            </div>

            {/* Pending Books */}
            <div>
              <h3 className="text-lg font-inter text-forest mb-2">Pending Books</h3>
              <ul className="space-y-2 text-sm text-soft-gray font-inter">
                {recentActivity.pending_books.length > 0 ? (
                  recentActivity.pending_books.map((book) => (
                    <li key={book.id} className="border-b border-soft-gray/50 py-1">
                      <span className="font-medium text-forest">{book.title}</span> – {book.store__name}
                    </li>
                  ))
                ) : (
                  <li className="text-soft-gray">No pending books</li>
                )}
              </ul>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-lg font-inter text-forest mb-2">Recent Orders</h3>
              <ul className="space-y-2 text-sm text-soft-gray font-inter">
                {recentActivity.recent_orders.length > 0 ? (
                  recentActivity.recent_orders.map((order) => (
                    <li key={order.id} className="border-b border-soft-gray/50 py-1">
                      {order.user__username} – <span className="text-burnt-orange">${order.total_price}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-soft-gray">No recent orders</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* Recent Authors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Recent Authors (Last 7 Days)</h2>
          {!recentAuthors.length ? (
            <p className="text-soft-gray">No recent authors</p>
          ) : (
            <ul className="space-y-2 text-sm text-soft-gray font-inter">
              {recentAuthors.map((author) => (
                <li key={author.id} className="border-b border-soft-gray/50 py-1">
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
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Genre Requests</h2>
          {!genreRequests.length ? (
            <p className="text-soft-gray">No genre requests</p>
          ) : (
            <ul className="space-y-2 text-sm text-soft-gray font-inter">
              {genreRequests.map((request) => (
                <li key={request.id} className="border-b border-soft-gray/50 py-1">
                  <span className="font-medium text-forest">{request.name}</span> – {request.status} – Requested by {request.requested_by__username}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Book Stats */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Book Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <p className="text-burnt-orange text-xl font-semibold">{bookStats.sales_stats.daily_sales}</p>
              <p className="text-forest text-sm font-inter">Books Sold Today</p>
            </div>
            <div>
              <p className="text-burnt-orange text-xl font-semibold">{bookStats.sales_stats.monthly_sales}</p>
              <p className="text-forest text-sm font-inter">Books Sold This Month</p>
            </div>
            <div>
              <p className="text-burnt-orange text-xl font-semibold">{bookStats.sales_stats.yearly_sales}</p>
              <p className="text-forest text-sm font-inter">Books Sold This Year</p>
            </div>
          </div>

          {/* Top-Selling Books Chart */}
          <h3 className="text-xl font-inter text-forest mb-3">Top 10 Best-Selling Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingData} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" tick={{ fill: "#6C584C", fontSize: 12 }} />
              <YAxis
                dataKey="title"
                type="category"
                tick={{ fill: "#6C584C", fontSize: 12 }}
                width={150}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DCD8C6",
                  borderRadius: "8px",
                  color: "#6C584C",
                  fontFamily: "Inter",
                }}
              />
              <Bar dataKey="total_sold" fill="#A37B5D" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>


          {/* Filter Buttons for Daily, Monthly, Yearly */}
          <div className="flex justify-start gap-4 mb-6">
            {["daily", "monthly", "yearly"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSalesFilter(filter)}
                className={`px-4 py-2 rounded-full ${salesFilter === filter ? "bg-forest text-white" : "bg-soft-gray"}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          {/* Book Sales Chart */}
          <h3 className="text-xl font-inter text-forest mb-3">Book Sales by {salesFilter.charAt(0).toUpperCase() + salesFilter.slice(1)}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getChartData()}>
              <XAxis
                dataKey={salesFilter === "daily" ? "day" : salesFilter === "monthly" ? "month" : "year"}
                tick={{ fill: "#6C584C", fontSize: 12, fontFamily: "Inter" }}
              />
              <YAxis tick={{ fill: "#6C584C", fontSize: 12, fontFamily: "Inter" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #DCD8C6",
                  borderRadius: "8px",
                  color: "#6C584C",
                  fontFamily: "Inter",
                }}
              />
              <Bar dataKey="quantity" fill="#A37B5D" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Chart */}
        {/* Earnings Filter Buttons */}
        <div className="flex justify-start gap-4 mb-6">
          {["weekly", "monthly", "yearly"].map((filter) => (
            <button
              key={filter}
              onClick={() => setEarningsFilter(filter)}
              className={`px-4 py-2 rounded-full ${earningsFilter === filter ? "bg-forest text-white" : "bg-soft-gray"
                }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Earnings Chart */}
        <h3 className="text-xl font-inter text-forest mb-4">
          Earnings by {earningsFilter.charAt(0).toUpperCase() + earningsFilter.slice(1)}
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={getEarningsData()}>
            <XAxis
              dataKey={
                earningsFilter === "weekly"
                  ? "week"
                  : earningsFilter === "monthly"
                    ? "month"
                    : "year"
              }
              tick={{ fill: "#6C584C", fontSize: 12, fontFamily: "Inter" }}
            />
            <YAxis
              tick={{ fill: "#6C584C", fontSize: 12, fontFamily: "Inter" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value) => `$${value}`}
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #DCD8C6",
                borderRadius: "8px",
                color: "#6C584C",
                fontFamily: "Inter",
              }}
            />
            <Bar dataKey="total_earnings" fill="#A37B5D" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div >
  );
};

export default AdminDashboard;
