import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api"


const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentActivity, setRecentActivity] = useState(null);
    const [earnings, setEarnings] = useState(null);

    useEffect(() => {
        fetchAdminStats();
        fetchRecentActivity();
        fetchEarnings();
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

    if (!stats || !recentActivity || !earnings) return <p>Loading...</p>;

    return (
        
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-600">Overview of the platform</p>

                {/* Stats and other content go here */}
                <div className="p-6 space-y-6">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <p className="text-lg font-bold">{stats.total_users}</p>
                            <p className="text-sm text-gray-500">Total Users</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <p className="text-lg font-bold">{stats.total_stores}</p>
                            <p className="text-sm text-gray-500">Total Stores</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <p className="text-lg font-bold">{stats.total_books}</p>
                            <p className="text-sm text-gray-500">Total Books</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <p className="text-lg font-bold">{stats.total_orders}</p>
                            <p className="text-sm text-gray-500">Total Orders</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-4">
                            <p className="text-lg font-bold">${stats.total_earnings}</p>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                        </div>
                    </div>


                    {/* Recent Activity Table */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <h3 className="text-lg font-medium">Pending Stores</h3>
                                <ul className="text-sm">
                                    {recentActivity.pending_stores.map((store) => (
                                        <li key={store.id} className="border-b py-2">
                                            {store.name} - {store.owner__username}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Pending Books</h3>
                                <ul className="text-sm">
                                    {recentActivity.pending_books.map((book) => (
                                        <li key={book.id} className="border-b py-2">
                                            {book.title} - {book.store__name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Recent Orders</h3>
                                <ul className="text-sm">
                                    {recentActivity.recent_orders.map((order) => (
                                        <li key={order.id} className="border-b py-2">
                                            {order.user__username} - ${order.total_price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Earnings Chart */}
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Earnings (Last 6 Months)</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={earnings}>
                                <XAxis
                                    dataKey="month"
                                    tickFormatter={(date) => new Date(date).toISOString().split("T")[0]}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total_earnings" fill="#4F46E5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
    );
};

export default AdminDashboard;
