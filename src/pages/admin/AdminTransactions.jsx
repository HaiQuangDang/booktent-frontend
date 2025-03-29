import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminFee, setAdminFee] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions/");
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminFee = async () => {
        try {
            const res = await api.get("/admin-fee/");
            console.log(res)
            setAdminFee(res.data.admin_fee_percentage);
        } catch (error) {
            console.error("Error fetching admin fee:", error);
        }
    };


    useEffect(() => {
        fetchTransactions();
        fetchAdminFee();
    }, []);

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
            window.location.reload()
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Manage Transactions</h2>

                {/* Admin Fee Update Section */}
                <div className="bg-white p-4 rounded-xl shadow-md mb-6">
                    <h3 className="text-lg font-semibold mb-2">Admin Fee Percentage</h3>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={adminFee}
                            onChange={handleAdminFeeChange}
                            className="border rounded px-3 py-1 w-20"
                        />
                        <button
                            onClick={updateAdminFee}
                            className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
                            disabled={updating}
                        >
                            {updating ? "Updating..." : "Update"}
                        </button>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Order ID</th>
                                <th className="p-3 text-left">Amount</th>
                                <th className="p-3 text-left">Payment Method</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id} className="border-t">
                                    <td className="p-3">
                                        <Link to={`/admin/transactions/${transaction.id}`} className="text-blue-500 hover:underline">
                                            {transaction.id}
                                        </Link>
                                    </td>
                                    <td className="p-3">{transaction.order}</td>
                                    <td className="p-3 font-semibold">${transaction.amount}</td>
                                    <td className="p-3">{transaction.payment_method}</td>
                                    <td className="p-3 font-semibold">
                                        <span className={`px-2 py-1 rounded text-white ${transaction.status === 'completed' ? 'bg-green-500' : transaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(transaction.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminTransactions;
