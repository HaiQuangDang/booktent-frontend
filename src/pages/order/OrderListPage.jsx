import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/list/");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total Price</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-3">{order.order_status}</td>
                  <td className="p-3">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="p-3">{order.payment_status}</td>
                  <td className="p-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
