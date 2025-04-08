import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminFee, setAdminFee] = useState("");
  const [updating, setUpdating] = useState(false);

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
    fetchAdminFee();
  }, [page, statusFilter]); // Fetch data when page or filter changes

  const fetchTransactions = async () => {
    try {
      const params = { 
        page,
        page_size: pageSize,
        ...(statusFilter && { status: statusFilter }),
      };
      const res = await api.get("/transactions/", { params });
      setTransactions(res.data.results); // Assumes 'results' holds paginated data
      setTotalPages(Math.ceil(res.data.count / pageSize)); // Calculate total pages
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminFee = async () => {
    try {
      const res = await api.get("/admin-fee/");
      setAdminFee(res.data.admin_fee_percentage);
    } catch (error) {
      console.error("Error fetching admin fee:", error);
    }
  };

  const handleAdminFeeChange = (e) => {
    setAdminFee(e.target.value);
  };

  const updateAdminFee = async () => {
    setUpdating(true);
    try {
      await api.patch("/admin-fee/", { admin_fee_percentage: adminFee });
      alert("Admin fee updated successfully!");
    } catch (error) {
      console.error("Error updating admin fee:", error);
      alert("Failed to update admin fee.");
    } finally {
      setUpdating(false);
      window.location.reload();
    }
  };

  // Filter handler
  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1); // Reset to page 1 when filter changes
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Transactions</h2>

        {/* Admin Fee */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <h3 className="text-xl font-playfair text-forest mb-3">Admin Fee Percentage</h3>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={adminFee}
              onChange={handleAdminFeeChange}
              className="border border-soft-gray rounded-md px-3 py-1 w-20 text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
            />
            <button
              onClick={updateAdminFee}
              className="bg-burnt-orange text-white px-3 py-1 rounded-md hover:bg-burnt-orange/80 transition-colors font-inter disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex justify-between mb-4">
          <div>
            <label htmlFor="statusFilter" className="mr-2 text-forest font-inter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="border border-soft-gray px-2 py-1 rounded-md text-soft-gray font-inter"
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Order ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Amount</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Payment Method</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Status</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                  <td className="p-4">
                    <Link
                      to={`/admin/transactions/${transaction.id}`}
                      className="text-burnt-orange hover:underline font-inter"
                    >
                      {transaction.id}
                    </Link>
                  </td>
                  <td className="p-4 text-soft-gray font-inter">{transaction.order}</td>
                  <td className="p-4 text-burnt-orange font-inter font-semibold">${transaction.amount}</td>
                  <td className="p-4 text-soft-gray font-inter">{transaction.payment_method}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm font-inter ${
                        transaction.status === "completed"
                          ? "bg-burnt-orange"
                          : transaction.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-4 text-soft-gray font-inter">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="bg-forest text-white px-3 py-1 rounded-md hover:bg-forest/80 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-forest font-inter">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="bg-forest text-white px-3 py-1 rounded-md hover:bg-forest/80 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminTransactions;
