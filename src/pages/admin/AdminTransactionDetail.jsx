import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminTransactionDetail() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetail = async () => {
      try {
        const res = await api.get(`/transactions/${id}/`);
        setTransaction(res.data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetail();
  }, [id]);

  if (loading) return <LoadingIndicator />;
  if (!transaction) return <p className="text-center text-red-500 font-inter">Transaction not found.</p>;

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-2xl font-playfair text-forest mb-6">Transaction #{transaction.id}</h2>
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Store:</strong> {transaction.store_name} (ID: {transaction.store})
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Customer:</strong> {transaction.user_name} (ID: {transaction.user_id})
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Order:</strong>{" "}
            <Link to={`/admin/orders/${transaction.order}`} className="text-burnt-orange hover:underline">
              #{transaction.order}
            </Link>
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Payment Method:</strong> {transaction.payment_method.toUpperCase()}
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Status:</strong>{" "}
            <span
              className={`font-semibold ${
                transaction.status === "completed"
                  ? "text-burnt-orange"
                  : transaction.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-500"
              }`}
            >
              {transaction.status}
            </span>
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Amount:</strong> <span className="text-burnt-orange">${transaction.amount}</span>
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Admin Fee:</strong> <span className="text-burnt-orange">${transaction.admin_fee}</span>
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Store Earnings:</strong>{" "}
            <span className="text-burnt-orange">${transaction.store_earnings}</span>
          </p>
          <p className="font-inter text-soft-gray mb-2">
            <strong className="text-forest">Created At:</strong> {new Date(transaction.created_at).toLocaleString()}
          </p>
          <p className="font-inter text-soft-gray">
            <strong className="text-forest">Updated At:</strong> {new Date(transaction.updated_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminTransactionDetail;