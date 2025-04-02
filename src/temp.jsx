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


    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center font-inter">Store Orders</h1>
            {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
            {!orders.length && <p className="text-soft-gray font-inter text-center">No orders found.</p>}
            {orders &&
                <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-soft-gray p-4 rounded-md mb-4 hover:bg-beige transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-forest font-inter">Order #{order.id}</p>
                                    <p className="text-soft-gray font-inter">
                                        Status: <span className="font-semibold text-forest">{order.order_status}</span>
                                    </p>
                                    <p className="text-soft-gray font-inter">
                                        Total: <span className="text-burnt-orange font-semibold">${order.total_price}</span>
                                    </p>
                                    <p className="text-soft-gray font-inter">
                                        Payment: {order.payment_method} - {order.payment_status}
                                    </p>
                                </div>
                                <Link
                                    to={`/store/orders/${order.id}`}
                                    className="text-forest hover:text-burnt-orange font-inter transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            }
        </div>
    );
};

export default StoreOrders;
