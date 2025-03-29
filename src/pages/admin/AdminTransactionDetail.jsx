import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import AdminSidebar from "../../components/admin/AdminSidebar";

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
    if (!transaction) return <p className="text-center text-red-500">Transaction not found.</p>;

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Transaction #{transaction.id}</h2>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <p><strong>Store:</strong> {transaction.store_name} (ID: {transaction.store})</p>
                    <p><strong>Customer:</strong> {transaction.user_name} (ID: {transaction.user_id})</p>
                    <p><strong>Order:</strong> <Link to={`/admin/orders/${transaction.order}`} className="text-blue-500 hover:underline">#{transaction.order}</Link></p>
                    <p><strong>Payment Method:</strong> {transaction.payment_method.toUpperCase()}</p>
                    <p><strong>Status:</strong> <span className={
                        transaction.status === "completed" ? "text-green-600 font-semibold" :
                        transaction.status === "pending" ? "text-yellow-600 font-semibold" : "text-red-600 font-semibold"
                    }>{transaction.status}</span></p>
                    <p><strong>Amount:</strong> ${transaction.amount}</p>
                    <p><strong>Admin Fee:</strong> ${transaction.admin_fee}</p>
                    <p><strong>Store Earnings:</strong> ${transaction.store_earnings}</p>
                    <p><strong>Created At:</strong> {new Date(transaction.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(transaction.updated_at).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminTransactionDetail;
