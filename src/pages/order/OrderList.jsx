import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

const OrderList = () => {
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
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl text-forest mb-8 text-center">
        Your Orders
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingIndicator />
          loading...
        </div>
      ) : orders.length === 0 ? (
        <p className="text-soft-gray font-inter text-center">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-beige text-left">
                <th className="p-4 text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-forest font-inter font-semibold">Date</th>
                <th className="p-4 text-forest font-inter font-semibold">Status</th>
                <th className="p-4 text-forest font-inter font-semibold">Price</th>
                <th className="p-4 text-forest font-inter font-semibold">Payment Status</th>
                <th className="p-4 text-forest font-inter font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-soft-gray hover:bg-beige transition-colors">
                  <td className="p-4 text-soft-gray font-inter">{order.id}</td>
                  <td className="p-4 text-soft-gray font-inter">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-soft-gray font-inter">{order.order_status}</td>
                  <td className="p-4 text-burnt-orange font-inter font-semibold">${parseFloat(order.total_price).toFixed(2)}</td>
                  <td className="p-4 text-soft-gray font-inter">{order.payment_status}</td>
                  <td className="p-4">
                    <Link
                      to={`/orders/${order.id}`}
                      className="bg-forest text-white px-3 py-1 rounded-md hover:bg-burnt-orange transition-colors font-inter"
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

export default OrderList;
