import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track the current page
  const [pageSize, setPageSize] = useState(10); // Track the page size
  const [statusFilter, setStatusFilter] = useState(""); // Track the status filter
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages

  useEffect(() => {
    fetchStores();
  }, [page, statusFilter]); // Re-fetch data when page or filter changes

  const fetchStores = async () => {
    try {
      const params = {
        page: page,
        page_size: pageSize,
        ...(statusFilter && { status: statusFilter }), // Only add status filter if it's set
      };
      const res = await api.get("/stores/", { params });
      setStores(res.data.results); // `results` holds the paginated data
      setTotalPages(Math.ceil(res.data.count / pageSize)); // Calculate total pages
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1); // Reset to page 1 when filter changes
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Stores</h2>

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
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

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
                      to={`/admin/stores/${store.id}`}
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

export default AdminStores;
