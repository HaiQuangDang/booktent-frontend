import { useEffect, useState } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator";

function AdminStoreManagement() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get("/store/");
            setStores(res.data);
        } catch (error) {
            console.error("Error fetching stores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStore = async (id) => {
        if (window.confirm("Are you sure you want to delete this store?")) {
            try {
                await api.delete(`/store/${id}/`);
                setStores(stores.filter(store => store.id !== id));
            } catch (error) {
                console.error("Error deleting store:", error);
            }
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/store/${id}/`, { status: newStatus });
            setStores(stores.map(store => store.id === id ? { ...store, status: newStatus } : store));
        } catch (error) {
            console.error("Error updating store status:", error);
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div>
            <h2>Manage Stores</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stores.map(store => (
                        <tr key={store.id}>
                            <td>{store.id}</td>
                            <td>{store.name}</td>
                            <td>{store.owner}</td>
                            <td>
                                <select value={store.status} onChange={(e) => handleUpdateStatus(store.id, e.target.value)}>
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteStore(store.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminStoreManagement;
