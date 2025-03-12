import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

const OrderDetail = () => {
  const { id } = useParams(); 
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/list/${id}/`);
        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Order #{order.id}</h2>
      <p>Status: <span className="font-medium">{order.status}</span></p>
      <p>Total Price: <span className="font-medium">${order.total_price}</span></p>
      <p>Payment Method: <span className="font-medium">{order.payment_method}</span></p>
      <p>Payment Status: <span className="font-medium">{order.payment_status}</span></p>
      <p>Ordered At: {new Date(order.created_at).toLocaleString()}</p>

      <h3 className="mt-4 text-lg font-semibold">Items</h3>
      <ul className="mt-2">
        {order.items.map(item => (
          <li key={item.id} className="border p-2 rounded my-2">
            {item.quantity}x <span className="font-medium">{item.book_title}</span> - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
