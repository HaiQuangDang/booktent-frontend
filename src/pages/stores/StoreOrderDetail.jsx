import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const ALLOWED_TRANSITIONS = {
    pending: ["processing", "canceled"],
    processing: ["shipped", "canceled"],
    shipped: ["completed", "refunded"],
    completed: [],
    canceled: [],
    refunded: []
};

const StoreOrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const response = await api.get(`/orders/my-store/${orderId}/`);
                setOrder(response.data);
                setNewStatus(response.data.order_status); // Default to current status
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    const handleUpdateStatus = async () => {
        if (!order) return;
        if (!ALLOWED_TRANSITIONS[order.order_status].includes(newStatus)) {
            alert("Invalid status transition.");
            return;
        }

        setUpdating(true);
        try {
            await api.patch(`/orders/update-status/${orderId}/`, { order_status: newStatus });
            setOrder({ ...order, order_status: newStatus });
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Order #{order.id} Details</h2>
            <p><strong>Status:</strong> {order.order_status}</p>
            <p><strong>Total:</strong> ${order.total_price}</p>
            <p><strong>Payment:</strong> {order.payment_method} - {order.payment_status}</p>

            <div className="mt-4">
                <label className="block font-semibold">Update Status:</label>
                <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="border p-2 rounded-lg w-full"
                >
                    <option value={order.order_status}>{order.order_status}</option>
                    {ALLOWED_TRANSITIONS[order.order_status].map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <button
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
                >
                    {updating ? "Updating..." : "Update Status"}
                </button>
            </div>
        </div>
    );
};

export default StoreOrderDetail;
