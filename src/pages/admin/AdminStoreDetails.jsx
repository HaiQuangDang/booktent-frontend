import { useEffect, useState } from "react";
import api from "../../api";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import LoadingIndicator from "../../components/LoadingIndicator";

const AdminStoreDetails = () => {
    const { id } = useParams();
    const [dashboardData, setDashboardData] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [bookStats, setBookStats] = useState(null);
    const [transactionStats, setTransactionStats] = useState(null);
    const [revenueView, setRevenueView] = useState("daily");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [queryDate, setQueryDate] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashboardRes, orderStatsRes, bookStatsRes, transactionStatsRes] = await Promise.all([
                    api.get(`/stores/${id}/`),
                    api.get(`/admin/store-orders/?store_id=${id}`),
                    api.get(`/admin/store-books/?store_id=${id}`),
                    api.get(`/admin/store-transactions/?store_id=${id}`),
                ]);
                setDashboardData(dashboardRes.data);
                setOrderStats(orderStatsRes.data);
                setBookStats(bookStatsRes.data);
                setTransactionStats(transactionStatsRes.data);
            } catch (err) {
                setError(err.response?.data?.error || "Something went wrong");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const handleQueryDate = async () => {
        try {
            const res = await api.get((`/admin/store-orders/?store_id=${id}`), {
                params: { date: queryDate },
            });
            setOrderStats((prev) => ({
                ...prev,
                query_date_orders: res.data.query_date_orders,
            }));
        } catch (err) {
            console.error("Failed to fetch query date orders:", err);
        }
    };

    if (loading) return <LoadingIndicator />;
    if (error) return <p className="text-red-500 font-inter text-center p-6">{error}</p>;


    return (
        <div className="container mx-auto p-8 min-h-screen bg-beige">
            <h2 className="text-3xl font-playfair text-forest mb-6">Store Details</h2>

            <h1 className="text-4xl font-playfair text-forest mb-2 text-center">{dashboardData.name}</h1>
            <a
                href={`/store/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-forest px-3 py-1.5 rounded-md bg-gray-50 hover:bg-beige transition-colors font-inter shadow-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" />
                </svg>
                View Store
            </a>
            <p className="text-soft-gray font-inter text-center mb-4">
                Status: <span className="text-burnt-orange font-semibold">{dashboardData.status.toUpperCase()}</span>
            </p>

            {/* Orders Section */}
            {orderStats && (
                <>
                    <h2 className="text-2xl font-playfair text-forest mb-6">Orders</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {Object.entries(orderStats.summary).map(([key, value]) => (
                            <div key={key} className="bg-white shadow-sm rounded-xl p-4 text-center">
                                <h3 className="text-sm text-soft-gray font-inter capitalize">{key.replace(/_/g, " ")}</h3>
                                <p className="text-2xl text-burnt-orange font-semibold font-inter">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {Object.entries(orderStats.comparison).map(([key, data]) => (
                            <div key={key} className="bg-white shadow-sm rounded-xl p-4">
                                <h3 className="text-sm text-soft-gray font-inter capitalize mb-2">{key.replace(/_/g, " ")}</h3>
                                <p className="text-sm font-inter">
                                    Current: <span className="text-forest font-semibold">{data.current}</span>
                                </p>
                                <p className="text-sm font-inter">
                                    Previous: <span className="text-forest font-semibold">{data.previous}</span>
                                </p>
                                <p className="text-sm font-inter">
                                    Change: <span className={data.change_percent > 0 ? "text-green-600" : "text-red-600"}>{data.change_percent}%</span>
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white shadow-sm rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-playfair text-forest mb-4">Orders Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={orderStats.chart_data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#4b5e40" fontFamily="Inter" fontSize={12} />
                                <YAxis allowDecimals={false} stroke="#4b5e40" fontFamily="Inter" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontFamily: "Inter",
                                        color: "#4b5e40",
                                    }}
                                />
                                <Line type="monotone" dataKey="count" stroke="#d97706" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow-sm rounded-xl p-6 mb-12">
                        <h3 className="text-xl font-playfair text-forest mb-4">Check Orders by Date</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="date"
                                value={queryDate}
                                onChange={(e) => setQueryDate(e.target.value)}
                                className="border border-soft-gray rounded-md px-4 py-2 text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
                            />
                            <button
                                onClick={handleQueryDate}
                                className="bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter"
                            >
                                Check
                            </button>
                        </div>
                        {orderStats.query_date_orders !== null && (
                            <p className="text-soft-gray font-inter">
                                Orders on <span className="text-forest font-semibold">{queryDate}</span>:{" "}
                                <span className="text-burnt-orange font-semibold">{orderStats.query_date_orders}</span>
                            </p>
                        )}
                    </div>
                </>
            )}

            {/* Books Section */}
            {bookStats && (
                <>
                    <h2 className="text-2xl font-playfair text-forest mb-6 mt-12">Books</h2>
                    <div className="mb-8">
                        <h3 className="text-xl font-playfair text-forest mb-4">Book Sales Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Object.entries(bookStats.sales_summary).map(([period, data]) => (
                                <div key={period} className="bg-white shadow-sm rounded-xl p-4 text-center">
                                    <h4 className="text-sm text-soft-gray font-inter capitalize">{period.replace(/_/g, " ")}</h4>
                                    <p className="text-2xl text-burnt-orange font-semibold font-inter">{data.total_sold}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-playfair text-forest mb-4">Low Stock Books</h3>
                        {bookStats.low_stock_books.length === 0 ? (
                            <p className="text-soft-gray font-inter bg-white rounded-xl p-4 shadow-sm">All books are well stocked 🎉</p>
                        ) : (
                            <ul className="space-y-2">
                                {bookStats.low_stock_books.map((book) => (
                                    <li key={book.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                                        <span className="font-inter text-forest">{book.title}</span>
                                        <span className="font-inter text-burnt-orange font-semibold">Stock: {book.stock_quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white shadow-sm rounded-xl p-6 mb-8">
                        <h3 className="text-xl font-playfair text-forest mb-4">Best Selling Books</h3>
                        {bookStats.best_sellers.length === 0 ? (
                            <p className="text-soft-gray font-inter">No sales yet, keep pushing! 😅</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={350}>
                                <BarChart data={bookStats.best_sellers} layout="vertical" margin={{ top: 20, right: 20, left: 140, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis type="number" stroke="#4b5e40" fontFamily="Inter" fontSize={12} allowDecimals={false} />
                                    <YAxis type="category" dataKey="title" stroke="#4b5e40" fontFamily="Inter" fontSize={12} width={130} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            fontFamily: "Inter",
                                            color: "#4b5e40",
                                        }}
                                    />
                                    <Bar dataKey="sold" fill="#d97706" barSize={24} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="bg-white shadow-sm rounded-xl p-6 mb-12">
                        <h3 className="text-xl font-playfair text-forest mb-4">Book Sales Over Time</h3>
                        {bookStats.daily_sales.length === 0 ? (
                            <p className="text-soft-gray font-inter">No sales data to display yet.</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={bookStats.daily_sales}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="date" stroke="#4b5e40" fontFamily="Inter" fontSize={12} />
                                    <YAxis allowDecimals={false} stroke="#4b5e40" fontFamily="Inter" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            fontFamily: "Inter",
                                            color: "#4b5e40",
                                        }}
                                    />
                                    <Line type="monotone" dataKey="sold" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </>
            )}

            {/* Transactions Section */}
            {transactionStats && (
                <>
                    <h2 className="text-2xl font-playfair text-forest mb-6 mt-12">Transactions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {Object.entries(transactionStats.totals).map(([key, value]) => (
                            <div key={key} className="bg-white shadow-sm rounded-xl p-4 text-center space-y-1">
                                <h4 className="text-sm text-soft-gray font-inter capitalize">{key.replace(/_/g, " ")}</h4>
                                <p className="text-2xl text-burnt-orange font-semibold font-inter">${value.revenue.toFixed(2)}</p>
                                <p className="text-sm text-soft-gray font-inter">
                                    {value.transactions} {value.transactions === 1 ? "transaction" : "transactions"}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mb-4">
                        {["daily", "monthly", "yearly"].map((type) => (
                            <button
                                key={type}
                                className={`px-4 py-2 rounded-full text-sm font-inter font-medium ${revenueView === type
                                    ? "bg-burnt-orange text-white"
                                    : "bg-soft-gray text-forest hover:bg-gray-300"
                                    } transition-colors`}
                                onClick={() => setRevenueView(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white shadow-sm rounded-xl p-6">
                        <h3 className="text-xl font-playfair text-forest mb-4">
                            Revenue - {revenueView.charAt(0).toUpperCase() + revenueView.slice(1)}
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={
                                    revenueView === "daily"
                                        ? transactionStats.daily_revenue
                                        : revenueView === "monthly"
                                            ? transactionStats.monthly_revenue
                                            : transactionStats.yearly_revenue
                                }
                                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey={revenueView === "daily" ? "date" : revenueView === "monthly" ? "month" : "year"}
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
                                    formatter={(value) => `$${value.toFixed(2)}`}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminStoreDetails;