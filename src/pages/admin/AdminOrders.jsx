import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // can make dynamic if needed
  const [totalPages, setTotalPages] = useState(1);

  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const statusOptions = ["pending", "processing", "shipped", "completed", "canceled", "refunded"];
  const paymentOptions = ["cod", "online"];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          page_size: pageSize,
        };
        if (statusFilter) params.order_status = statusFilter;
        if (paymentFilter) params.payment_method = paymentFilter;

        const res = await api.get("/admin/orders/", { params });
        setOrders(res.data.results);
        setTotalPages(Math.ceil(res.data.count / pageSize));
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, pageSize, statusFilter, paymentFilter]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Orders</h2>

        {/* Filters */}
        <div className="mb-6 flex gap-4 max-w-4xl">
          <div className="flex-1">
            <label className="block text-sm font-medium text-forest mb-1">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-soft-gray rounded-md"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-forest mb-1">Payment Method</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full p-2 border border-soft-gray rounded-md"
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

        {/* Table */}
        {loading ? (
          <LoadingIndicator />
        ) : orders.length === 0 ? (
          <p className="text-center text-red-500 font-inter">No orders found.</p>
        ) : (
          <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-forest/10">
                  <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Customer</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Store</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Status</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Payment</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                    <td className="p-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="text-burnt-orange hover:underline font-inter"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="p-4 text-soft-gray font-inter">{order.customer_name}</td>
                    <td className="p-4 text-soft-gray font-inter">{order.store_name}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-inter ${
                          order.order_status === "pending"
                            ? "bg-yellow-500"
                            : order.order_status === "shipped"
                            ? "bg-forest"
                            : order.order_status === "completed"
                            ? "bg-burnt-orange"
                            : "bg-gray-500"
                        }`}
                      >
                        {order.order_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-inter ${
                          order.payment_status === "pending"
                            ? "bg-yellow-500"
                            : order.payment_status === "paid"
                            ? "bg-burnt-orange"
                            : "bg-red-500"
                        }`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-soft-gray font-inter">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-forest text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="text-forest font-semibold font-inter">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-forest text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
