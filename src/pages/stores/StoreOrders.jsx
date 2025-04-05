import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const StoreOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const statusOptions = ["pending", "processing", "shipped", "completed", "canceled", "refunded"];
  const paymentOptions = ["cod", "online"];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = {};
        if (statusFilter) params.order_status = statusFilter;
        if (paymentFilter) params.payment_method = paymentFilter;

        const response = await api.get("/orders/my-store/", { params });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, paymentFilter]);

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl text-forest mb-8 text-center">Orders</h1>

      {/* Filters */}
      <div className="mb-6 max-w-4xl mx-auto flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-forest font-inter mb-1">Order Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-forest font-inter mb-1">Payment Method</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
          >
            <option value="">All Methods</option>
            {paymentOptions.map((method) => (
              <option key={method} value={method}>
                {method.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders */}
      {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
      {!loading && !orders.length && <p className="text-soft-gray font-inter text-center">No orders found.</p>}
      {!loading && orders.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-soft-gray p-4 rounded-md mb-4 hover:bg-beige transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-forest font-inter">Order #{order.id}</p>

                  {/* Order Status */}
                  <p className="text-soft-gray font-inter">
                    Status:
                    <span className={`ml-2 text-sm font-semibold px-2 py-1 rounded-md inline-block 
                      ${order.order_status === 'completed' ? 'bg-forest text-white' :
                        order.order_status === 'cancelled' ? 'bg-red-500 text-white' :
                          'bg-beige text-forest'}
                    `}>
                      {order.order_status.toUpperCase()}
                    </span>
                  </p>

                  {/* Payment Info */}
                  <p className="text-soft-gray font-inter">
                    Payment:
                    <span className="ml-1 font-semibold text-burnt-orange">
                      {order.payment_method.toUpperCase()} - 
                    </span>
                     
                    <span className={`ml-2 text-sm font-semibold px-2 py-1 rounded-md inline-block 
                      ${order.payment_status === 'paid' ? 'bg-forest text-white' :
                        order.payment_status === 'failed' ? 'bg-red-500 text-white' :
                          'bg-beige text-forest'}
                    `}>
                      {order.payment_status.toUpperCase()}
                    </span>
                  </p>

                  {/* Total Price */}
                  <p className="text-soft-gray font-inter">
                    Total: <span className="text-burnt-orange font-semibold">${order.total_price}</span>
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
      )}
    </div>
  );

};

export default StoreOrders;