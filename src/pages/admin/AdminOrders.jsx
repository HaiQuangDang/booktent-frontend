import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/admin/orders/");
                setOrders(res.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <LoadingIndicator />;
    if (!orders.length) return <p className="text-center text-red-500">No orders found.</p>;

    return (
        <div className="flex">
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
                <div className="bg-white p-4 rounded-xl shadow-md overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Customer</th>
                                <th className="p-3 text-left">Store</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Payment</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-3">
                                        <Link to={`/admin/orders/${order.id}`} className="text-blue-500 hover:underline">
                                            {order.id}
                                        </Link>
                                    </td>
                                    <td className="p-3">{order.customer_name}</td>
                                    <td className="p-3">{order.store_name}</td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 rounded-full text-white text-sm 
                                            ${order.order_status === "pending" ? "bg-yellow-500" :
                                               order.order_status === "shipped" ? "bg-blue-500" :
                                               order.order_status === "completed" ? "bg-green-500" :
                                               "bg-gray-500"}`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-3 py-1 rounded-full text-white text-sm 
                                            ${order.payment_status === "pending" ? "bg-yellow-500" :
                                               order.payment_status === "paid" ? "bg-green-500" :
                                               "bg-red-500"}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminOrders;
