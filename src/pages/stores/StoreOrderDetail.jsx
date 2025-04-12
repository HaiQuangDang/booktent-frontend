import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const ALLOWED_TRANSITIONS = {
    pending: ["processing"],
    processing: ["shipped"],
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
    const [canceling, setCanceling] = useState(false);

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

    useEffect(() => {
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
            // setOrder({ ...order, order_status: newStatus });
            fetchOrderDetail();
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;
        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
        if (!confirmCancel) return;

        setCanceling(true);
        try {
            const res = await api.post(`/orders/cancel/${orderId}/`);
            console.log(res.data.message)
        } catch (error) {
            console.error("Error canceling order:", error);
        } finally {
            fetchOrderDetail();
        }
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">Store Order Details</h1>

            {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
            {!order && <p className="text-soft-gray font-inter text-center">Order not found.</p>}
            {order && (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto transition-all hover:shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-forest font-inter">Order #{order.id}</h2>
                        <div className="flex items-center gap-3">
                            <span
                                className={`text-lg font-semibold px-3 py-1 rounded-md font-inter ${order.order_status === "completed" ? "bg-forest text-white" : "bg-beige text-forest"
                                    }`}
                            >
                                {order.order_status.toUpperCase()}
                            </span>
                            {/* Status Update */}
                            {order.order_status !== "completed" &&
                                order.order_status !== "canceled" &&
                                order.order_status !== "refunded" && (
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="p-1 border border-soft-gray rounded-md bg-white text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
                                        >
                                            <option value={order.order_status}>
                                                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                            </option>
                                            {ALLOWED_TRANSITIONS[order.order_status].map((status) => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleUpdateStatus}
                                            disabled={updating}
                                            className={`p-2 rounded-md text-white font-inter transition-colors ${updating ? "bg-soft-gray cursor-not-allowed" : "bg-forest hover:bg-burnt-orange"
                                                }`}
                                            title="Update Status"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            {/* Cancel Order */}
                            {(order.order_status === "pending" || order.order_status === "processing") && (
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={canceling}
                                    className={`p-2 rounded-md text-white font-inter transition-colors ${canceling ? "bg-soft-gray cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                                        }`}
                                    title="Cancel Order"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="space-y-3 text-soft-gray font-inter">
                        <p>
                            <strong className="text-forest">Total:</strong>{" "}
                            <span className="text-burnt-orange font-semibold">${order.total_price}</span>
                        </p>
                        <p>
                            <strong className="text-forest">Payment:</strong> {order.payment_method} - {order.payment_status}
                        </p>

                        <p>
                            <strong className="text-forest">Customer:</strong> {order.customer_name}
                        </p>
                        <p>
                            <strong className="text-forest">Ship to addres:</strong> {order.address}
                        </p>
                        <p>
                            <strong className="text-forest">Phone:</strong> {order.phone}
                        </p>
                    </div>

                    <h3 className="text-lg font-semibold text-forest mt-6 mb-3 font-inter">Items</h3>
                    <ul className="space-y-2">
                        {order.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between p-3 bg-beige rounded-md hover:bg-opacity-80 transition-colors"
                            >
                                <span className="text-soft-gray font-inter">
                                    {item.quantity}x <span className="font-semibold text-forest">{item.book_title}</span>
                                </span>
                                <span className="text-burnt-orange font-semibold font-inter">${item.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StoreOrderDetail;
