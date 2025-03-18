import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const StoreOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/my-store/");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);



    if (loading) return <p>Loading...</p>;
    if (!orders.length) return <p>No orders found.</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Store Orders</h2>
            {orders.map(order => (
                <div key={order.id} className="border p-4 rounded-lg mb-4">
                    <p>Order #{order.id}</p>
                    <p>Status: <strong>{order.order_status}</strong></p>
                    <p>Total: ${order.total_price}</p>
                    <p>Payment: {order.payment_method} - {order.payment_status}</p>
                    <Link
                        to={`/store/orders/${order.id}`}
                        className="text-blue-500 underline mt-2 inline-block"
                    >
                        View Details
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default StoreOrders;
