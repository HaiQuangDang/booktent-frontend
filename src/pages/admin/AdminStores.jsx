import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

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

  const handleDeleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      await api.delete(`/stores/${id}/`);
      alert("Store deleted successfully!");
      setStores(stores.filter((store) => store.id !== id));
    } catch (error) {
      console.error("Error deleting store:", error);
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
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Stores</h2>
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Name</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Owner</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Status</th>
                <th className="p-4 text-center text-forest font-inter font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                  <td className="p-4 text-soft-gray font-inter">{store.id}</td>
                  <td className="p-4">
                    <Link
                      to={`/store/${store.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-burnt-orange hover:underline font-inter"
                    >
                      {store.name}
                    </Link>
                  </td>
                  <td className="p-4 text-soft-gray font-inter">{store.owner}</td>
                  <td className="p-4">
                    <select
                      value={store.status}
                      onChange={(e) => handleUpdateStatus(store.id, e.target.value)}
                      className="border border-soft-gray px-2 py-1 rounded-md text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteStore(store.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-inter"
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
    </div>
  );
}

export default AdminStores;