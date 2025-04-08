import { useEffect, useState } from "react";
import api from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import LoadingIndicator from "../../components/LoadingIndicator";

function AdminRequestGenres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchGenres();
  }, [statusFilter]);

  const fetchGenres = async () => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get("/admin/genres-request/", { params });
      setGenres(res.data);
    } catch (error) {
      console.error("Error fetching genre requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/genres-request/${id}/approve/`);
      alert("Genre approved successfully!");
      setGenres((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: "approved" } : g))
      );
    } catch (error) {
      alert(error.response?.data?.error || "Error approving genre");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/genres-request/${id}/reject/`);
      alert("Genre rejected.");
      setGenres((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: "rejected" } : g))
      );
    } catch (error) {
      alert(error.response?.data?.error || "Error rejecting genre");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this genre request?")) return;
    try {
      await api.delete(`/admin/genres-request/${id}/`);
      setGenres((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error deleting genre request:", error);
    }
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Genre Requests</h2>

        <div className="flex justify-between mb-6">
          <div>
            <label htmlFor="statusFilter" className="mr-2 text-forest font-inter">Filter by Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={handleFilterChange}
              className="border border-soft-gray px-2 py-1 rounded-md text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Name</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Description</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Status</th>
                <th className="p-4 text-center text-forest font-inter font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((genre) => (
                <tr key={genre.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                  <td className="p-4 text-soft-gray font-inter">{genre.id}</td>
                  <td className="p-4 text-soft-gray font-inter">{genre.name}</td>
                  <td className="p-4 text-soft-gray font-inter">{genre.description}</td>
                  <td className="p-4 capitalize text-soft-gray font-inter">{genre.status}</td>
                  <td className="p-4 text-center flex gap-2 justify-center">
                    {genre.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(genre.id)}
                          className="bg-burnt-orange text-white px-3 py-1 rounded-md hover:bg-burnt-orange/80 transition-colors font-inter"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(genre.id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors font-inter"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(genre.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-inter"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {genres.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-soft-gray p-6 font-inter">
                    No genre requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminRequestGenres;