import { useEffect, useState } from "react";
import api from "../../api";

const STATUS_CHOICES = {
    pending: ["processing", "canceled"],
    processing: ["shipped", "canceled"],
    shipped: ["completed"]
};

const StoreOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/store/orders/");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/store/update-status/${orderId}/`, {
                status: newStatus,
            });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Store Orders</h2>
            {orders.map(order => (
                <div key={order.id} className="border p-4 rounded-lg mb-4">
                    <p>Order #{order.id}</p>
                    <p>Status: <strong>{order.status}</strong></p>
                    <p>Total: ${order.total_price}</p>
                    <p>Payment: {order.payment_method} - {order.payment_status}</p>

                    {STATUS_CHOICES[order.status] && (
                        <select
                            onChange={e => handleStatusChange(order.id, e.target.value)}
                            className="mt-2 p-2 border rounded"
                            defaultValue=""
                        >
                            <option value="" disabled>Select new status</option>
                            {STATUS_CHOICES[order.status].map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
        </div>
    );
};

export default StoreOrders;
