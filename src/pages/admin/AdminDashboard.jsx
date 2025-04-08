import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [recentAuthors, setRecentAuthors] = useState(null);
  const [genreRequests, setGenreRequests] = useState(null);

  useEffect(() => {
    fetchAdminStats();
    fetchRecentActivity();
    fetchEarnings();
    fetchRecentAuthors(); // Fetch recent authors
    fetchGenreRequests(); // Fetch genre requests
  }, []);

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

  const fetchEarnings = async () => {
    try {
      const res = await api.get("/admin/earnings/");
      setEarnings(res.data.earnings_per_month);
    } catch (error) {
      console.error("Error fetching earnings", error);
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

  if (!stats || !recentActivity || !earnings || !recentAuthors || !genreRequests)
    return <p className="text-center text-forest font-inter">Loading...</p>;

  return (
    <div className="flex-1 p-6 bg-beige min-h-screen">
      <h1 className="text-3xl font-playfair text-forest mb-2">Admin Dashboard</h1>
      <p className="text-soft-gray font-inter mb-6">Overview of the platform</p>

      <div className="space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Users", value: stats.total_users },
            { label: "Total Stores", value: stats.total_stores },
            { label: "Total Books", value: stats.total_books },
            { label: "Total Orders", value: stats.total_orders },
            { label: "Total Earnings", value: `$${stats.total_earnings}` },
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
                {recentActivity.pending_stores.map((store) => (
                  <li key={store.id} className="border-b border-soft-gray/50 py-1">
                    <span className="font-medium text-forest">{store.name}</span> – {store.owner__username}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pending Books */}
            <div>
              <h3 className="text-lg font-inter text-forest mb-2">Pending Books</h3>
              <ul className="space-y-2 text-sm text-soft-gray font-inter">
                {recentActivity.pending_books.map((book) => (
                  <li key={book.id} className="border-b border-soft-gray/50 py-1">
                    <span className="font-medium text-forest">{book.title}</span> – {book.store__name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Orders */}
            <div>
              <h3 className="text-lg font-inter text-forest mb-2">Recent Orders</h3>
              <ul className="space-y-2 text-sm text-soft-gray font-inter">
                {recentActivity.recent_orders.map((order) => (
                  <li key={order.id} className="border-b border-soft-gray/50 py-1">
                    {order.user__username} – <span className="text-burnt-orange">${order.total_price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Authors */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Recent Authors (Last 7 Days)</h2>
          <ul className="space-y-2 text-sm text-soft-gray font-inter">
            {recentAuthors.map((author) => (
              <li key={author.id} className="border-b border-soft-gray/50 py-1">
                <span className="font-medium text-forest">{author.name}</span> – {new Date(author.created_at).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        {/* Genre Requests */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Genre Requests</h2>
          <ul className="space-y-2 text-sm text-soft-gray font-inter">
            {genreRequests.map((request) => (
              <li key={request.id} className="border-b border-soft-gray/50 py-1">
                <span className="font-medium text-forest">{request.name}</span> – {request.status} – Requested by {request.requested_by__username}
              </li>
            ))}
          </ul>
        </div>

        {/* Earnings Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Earnings (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earnings}>
              <XAxis
                dataKey="month"
                tickFormatter={(date) =>
                  new Date(date).toLocaleString("default", { month: "short" })
                }
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
              <Bar dataKey="total_earnings" fill="#A37B5D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
