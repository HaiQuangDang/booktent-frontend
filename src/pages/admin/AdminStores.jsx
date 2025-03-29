import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminStores() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStores = async () => {
        try {
            const res = await api.get("/stores/");
            setStores(res.data);
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const handleDeleteStore = async (id) => {
        if (window.confirm("Are you sure you want to delete this store?")) {
            try {
                await api.delete(`/stores/${id}/`);
                alert("Store deleted successfully!");
                setStores(stores.filter((store) => store.id !== id));
            } catch (error) {
                console.error("Error deleting store:", error);
            }
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/stores/${id}/`, { status: newStatus });
            setStores(stores.map((store) => (store.id === id ? { ...store, status: newStatus } : store)));
        } catch (error) {
            console.error("Error updating store status:", error);
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Manage Stores</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-3 text-left">ID</th>
                            <th className="border p-3 text-left">Name</th>
                            <th className="border p-3 text-left">Owner</th>
                            <th className="border p-3 text-left">Status</th>
                            <th className="border p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((store) => (
                            <tr key={store.id} className="hover:bg-gray-100">
                                <td className="border p-3">{store.id}</td>
                                <td className="border p-3">
                                    <Link
                                        to={`/store/${store.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {store.name}
                                    </Link>
                                </td>
                                <td className="border p-3">{store.owner}</td>
                                <td className="border p-3">
                                    <select
                                        value={store.status}
                                        onChange={(e) => handleUpdateStatus(store.id, e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </td>
                                <td className="border p-3 text-center">
                                    <button
                                        onClick={() => handleDeleteStore(store.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminStores;
