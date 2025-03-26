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
                console.log(err.response.data.error)
                setError(err.response.data.error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) return <p className="text-center">Loading dashboard...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Store Dashboard</h1>

            {/* Total Orders & Earnings */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white shadow-md p-4 rounded-md">
                    <h2 className="text-lg font-semibold">Total Orders</h2>
                    <p className="text-2xl">{dashboardData.total_orders}</p>
                    <Link to="/store/orders" className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                        View Orders
                    </Link>
                </div>
                <div className="bg-white shadow-md p-4 rounded-md">
                    <h2 className="text-lg font-semibold">Total Earnings</h2>
                    <p className="text-2xl">${dashboardData.total_earnings}</p>
                </div>
            </div>

            {/* Low Stock Books */}
            <div className="bg-white shadow-md p-4 rounded-md mb-6">
                <h2 className="text-lg font-semibold mb-2">Low Stock Books</h2>
                {dashboardData.low_stock_books.length === 0 ? (
                    <p className="text-gray-500">No low stock books.</p>
                ) : (
                    <ul className="list-disc ml-5">
                        {dashboardData.low_stock_books.map((book, index) => (
                            <li key={index}>{book.title} - {book.stock_quantity} left</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow-md p-4 rounded-md mb-6">
                <h2 className="text-lg font-semibold mb-2">Recent Orders</h2>
                {dashboardData.recent_orders.length === 0 ? (
                    <p className="text-gray-500">No recent orders.</p>
                ) : (
                    <ul className="list-disc ml-5">
                        {dashboardData.recent_orders.map(order => (
                            <li key={order.id}>
                                Order #{order.id} - ${order.total_price} - {order.order_status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Recent Books */}
            <div className="bg-white shadow-md p-4 rounded-md mb-6">
                <h2 className="text-lg font-semibold mb-2">Recent Books</h2>
                {dashboardData.recent_books.length === 0 ? (
                    <p className="text-gray-500">No recent books.</p>
                ) : (
                    <ul className="list-disc ml-5">
                        {dashboardData.recent_books.map(book => (
                            <li key={book.id}>{book.title} - ${book.price} - {book.stock_quantity} in stock</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white shadow-md p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
                {dashboardData.recent_transactions.length === 0 ? (
                    <p className="text-gray-500">No recent transactions.</p>
                ) : (
                    <ul className="list-disc ml-5">
                        {dashboardData.recent_transactions.map(transaction => (
                            <li key={transaction.id}>
                                ${transaction.amount} - {transaction.payment_status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default StoreDashboard;
