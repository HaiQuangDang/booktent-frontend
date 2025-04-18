import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await api.get(`/admin/orders/${id}/`);
        setOrder(res.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <LoadingIndicator />;
  if (!order) return <p className="text-center text-red-500 font-inter">Order not found.</p>;

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-playfair text-forest mb-6">Order #{order.id} Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Customer:</strong> {order.customer_name} (ID: {order.user})
            </p>
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Store:</strong> {order.store_name}
            </p>
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Status:</strong>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-inter ${
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
            </p>
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Payment Status:</strong>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-white text-sm font-inter ${
                  order.payment_status === "pending"
                    ? "bg-yellow-500"
                    : order.payment_status === "paid"
                    ? "bg-burnt-orange"
                    : "bg-red-500"
                }`}
              >
                {order.payment_status}
              </span>
            </p>
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Ordered Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Address:</strong> {order.address}
            </p>
            <p className="font-inter text-soft-gray">
              <strong className="text-forest">Phone:</strong> {order.phone}
            </p>
          </div>

          {/* Ordered Books */}
          <h3 className="text-xl font-playfair text-forest mt-6 mb-3">Ordered Books</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-forest/10">
                  <th className="p-4 text-left text-forest font-inter font-semibold">Book Title</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Quantity</th>
                  <th className="p-4 text-left text-forest font-inter font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                    <td className="p-4 text-soft-gray font-inter">{item.book_title}</td>
                    <td className="p-4 text-soft-gray font-inter">{item.quantity}</td>
                    <td className="p-4 text-burnt-orange font-inter font-semibold">${item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Price */}
          <p className="text-lg font-inter text-forest mt-6 text-right">
            Total Price: <span className="text-burnt-orange font-semibold">${order.total_price}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;