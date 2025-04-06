import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";


function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/admin/orders/");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingIndicator />;
  if (!orders.length) return <p className="text-center text-red-500 font-inter">No orders found.</p>;

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Orders</h2>
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
      </div>
    </div>
  );
}

export default AdminOrders;