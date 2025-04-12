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
              className="bg-white shadow-sm rounded-xl p-6 mb-4 hover:shadow-md transition-shadow border border-soft-gray"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Order Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-forest">Order #{order.id}</p>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full font-inter ${order.order_status === "completed"
                          ? "bg-forest text-white"
                          : order.order_status === "cancelled"
                            ? "bg-red-500 text-white"
                            : "bg-beige text-forest border border-soft-gray"
                        }`}
                    >
                      {order.order_status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-soft-gray font-inter">Payment:</p>
                    <span className="font-semibold text-burnt-orange font-inter">
                      {order.payment_method.toUpperCase()}
                    </span>
                    <span
                      className={`text-sm font-semibold px-3 py-1 rounded-full font-inter ${order.payment_status === "paid"
                          ? "bg-forest text-white"
                          : order.payment_status === "failed"
                            ? "bg-red-500 text-white"
                            : "bg-beige text-forest border border-soft-gray"
                        }`}
                    >
                      {order.payment_status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-soft-gray font-inter">
                    Total: <span className="text-burnt-orange font-semibold">${order.total_price.toFixed(2)}</span>
                  </p>
                </div>

                {/* Right: Action */}
                <div className="flex items-center justify-end">
                  <Link
                    to={`/store/orders/${order.id}`}
                    className="bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};

export default StoreOrders;