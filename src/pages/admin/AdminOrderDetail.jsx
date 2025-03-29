import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminOrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await api.get(`/admin/orders/${id}/`);
                setOrder(res.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [id]);

    if (loading) return <LoadingIndicator />;
    if (!order) return <p className="text-center text-red-500">Order not found.</p>;

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Order #{order.id} Details</h2>

                    {/* Order Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <p><strong>Customer:</strong> {order.customer_name} (ID: {order.user})</p>
                        <p><strong>Store:</strong> {order.store_name}</p>
                        <p>
                            <strong>Status:</strong> 
                            <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm 
                                ${order.order_status === "pending" ? "bg-yellow-500" :
                                   order.order_status === "shipped" ? "bg-blue-500" :
                                   order.order_status === "completed" ? "bg-green-500" :
                                   "bg-gray-500"}`}>
                                {order.order_status}
                            </span>
                        </p>
                        <p>
                            <strong>Payment Status:</strong> 
                            <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm 
                                ${order.payment_status === "pending" ? "bg-yellow-500" :
                                   order.payment_status === "paid" ? "bg-green-500" :
                                   "bg-red-500"}`}>
                                {order.payment_status}
                            </span>
                        </p>
                        <p><strong>Ordered Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
                    </div>

                    {/* Ordered Books */}
                    <h3 className="text-xl font-semibold mt-6 mb-3">Ordered Books</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2">Book Title</th>
                                    <th className="border border-gray-300 p-2">Quantity</th>
                                    <th className="border border-gray-300 p-2">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id} className="text-center">
                                        <td className="border border-gray-300 p-2">{item.book.title}</td>
                                        <td className="border border-gray-300 p-2">{item.quantity}</td>
                                        <td className="border border-gray-300 p-2 font-semibold">${item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Total Price */}
                    <p className="text-lg font-semibold mt-6 text-right">
                        Total Price: <span className="text-green-600">${order.total_price}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AdminOrderDetail;
