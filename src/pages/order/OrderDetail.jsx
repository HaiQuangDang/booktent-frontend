import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";
const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/retrieve/${id}/`);
      setOrder(response.data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCanceling(true);
    try {
      await api.post(`/orders/cancel/${id}/`);
      setOrder((prevOrder) => ({ ...prevOrder, status: "Cancelled" }));
    } catch (error) {
      console.error("Failed to cancel order", error);
    } finally {
      fetchOrder();
      setCanceling(false);
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl text-forest mb-8 text-center">Order Details</h1>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <LoadingIndicator />
          loading...
        </div>
      )}
      {!order && <p className="text-soft-gray font-inter text-center">Order not found.</p>}
      {order && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto transition-all hover:shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-forest font-inter">Order #{order.id}</h2>
            <span className="text-lg font-semibold text-forest bg-beige px-3 py-1 rounded-md">
              {order.order_status.toUpperCase()}
            </span>
          </div>
          <div className="space-y-2 text-soft-gray font-inter">
            <p>Ordered at: <span className="font-semibold">{new Date(order.created_at).toLocaleString()}</span></p>
            <p>Total: <span className="font-semibold text-burnt-orange">${order.total_price}</span></p>
            <p>Payment Method: <span className="font-semibold text-forest">{order.payment_method.toUpperCase()}</span></p>
            <p>Payment Status: <span className="font-semibold text-forest">{order.payment_status.toUpperCase()}</span></p>
            <p>Delivery Address: <span className="font-semibold">{order.address}</span></p>
            <p>Phone: <span className="font-semibold">{order.phone}</span></p>
            <p>Store: <Link to={`/store/${order.store}`} className="font-semibold text-forest hover:text-burnt-orange transition-colors">{order.store_name}</Link></p>
          </div>

          <h3 className="mt-6 text-lg font-semibold text-forest font-inter">Items</h3>
          <ul className="mt-2 space-y-2">
            {order.items.map(item => (
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

          {order.order_status === "pending" && (
            <button
              onClick={handleCancelOrder}
              disabled={canceling}
              className={`mt-6 px-6 py-2 rounded-md text-white font-inter transition-colors ${canceling ? "bg-soft-gray cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
            >
              {canceling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
