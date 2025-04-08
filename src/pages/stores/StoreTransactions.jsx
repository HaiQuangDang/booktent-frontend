import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const StoreTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const statusOptions = ["pending", "completed", "failed", "refunded"];
  const paymentOptions = ["cod", "online"];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          page_size: pageSize,
          ...(statusFilter && { status: statusFilter }),
          ...(paymentFilter && { payment_method: paymentFilter }),
        };

        const response = await api.get("/transactions/", { params });
        setTransactions(response.data.results || []);
        setTotalPages(Math.ceil(response.data.count / pageSize));
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [statusFilter, paymentFilter, page, pageSize]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl text-forest mb-8 text-center">Transactions</h1>

      {/* Filters */}
      <div className="mb-6 max-w-4xl mx-auto flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-forest font-inter mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
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
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setPage(1);
            }}
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

      {/* Transactions */}
      {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
      {!loading && !transactions.length && (
        <p className="text-soft-gray font-inter text-center">No transactions found.</p>
      )}
      {!loading && transactions.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-soft-gray p-4 rounded-md mb-4 hover:bg-beige transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-forest font-inter">
                    Transaction #{transaction.id}
                  </p>
                  <p className="text-soft-gray font-inter">
                    User: <span className="text-forest">{transaction.user_name} (ID: {transaction.user_id})</span>
                  </p>
                  <p className="text-soft-gray font-inter">
                    Date: {formatDate(transaction.created_at)}
                  </p>
                  <p className="text-soft-gray font-inter">
                    Payment: {transaction.payment_method.toUpperCase()}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <Link
                    to={`/store/orders/${transaction.order}`}
                    className="text-forest hover:text-burnt-orange font-inter transition-colors"
                  >
                    Order #{transaction.order}
                  </Link>
                  <p className="text-lg font-semibold text-burnt-orange font-inter">
                    ${transaction.amount}
                  </p>
                  <p
                    className={`text-sm font-semibold px-2 py-1 rounded-md font-inter inline-block ${transaction.status === "completed"
                        ? "bg-forest text-white"
                        : transaction.status === "failed" || transaction.status === "refunded"
                        ? "bg-red-500 text-white"
                        : "bg-beige text-forest"
                      }`}
                  >
                    {transaction.status.toUpperCase()}
                  </p>
                  <p className="text-sm text-soft-gray font-inter">
                    Fee: <span className="text-forest">${transaction.admin_fee}</span>
                  </p>
                  <p className="text-sm text-soft-gray font-inter">
                    Earnings: <span className="text-burnt-orange font-semibold">${transaction.store_earnings}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center max-w-4xl mx-auto mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-forest text-white px-3 py-1 rounded-md hover:bg-forest/80 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-forest font-inter">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="bg-forest text-white px-3 py-1 rounded-md hover:bg-forest/80 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StoreTransactions;
