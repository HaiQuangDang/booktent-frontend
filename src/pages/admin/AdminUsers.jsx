import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import api from "../../api";
import { USER } from "../../constants";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers("/user/users/");
  }, []);

  const fetchUsers = async (url) => {
    try {
      setLoading(true);
      const res = await api.get(url);
      const admin = JSON.parse(localStorage.getItem(USER));
      const filteredUsers = res.data.results.filter((user) => user.id !== admin.id);

      setUsers(filteredUsers);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/user/delete/${id}/`);
      alert("User deleted successfully!");
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "An error occurred while deleting the user.";
      alert(errorMessage);
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h1 className="text-3xl font-playfair text-forest mb-6">Manage Users</h1>

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Username</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Email</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                  <td className="p-4 text-soft-gray font-inter">{user.id}</td>
                  <td className="p-4 text-forest font-inter">{user.username}</td>
                  <td className="p-4 text-soft-gray font-inter">{user.email}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-inter"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4">
            <button
              disabled={!prevPage}
              onClick={() => fetchUsers(prevPage)}
              className={`px-4 py-2 rounded-md font-inter ${
                prevPage ? "bg-forest text-white hover:bg-forest/90" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Previous
            </button>

            <button
              disabled={!nextPage}
              onClick={() => fetchUsers(nextPage)}
              className={`px-4 py-2 rounded-md font-inter ${
                nextPage ? "bg-forest text-white hover:bg-forest/90" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
