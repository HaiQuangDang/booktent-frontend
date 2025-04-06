// src/pages/admin/AdminUsers.jsx
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import api from "../../api";
import { USER } from "../../constants";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/users/");
      const admin = JSON.parse(localStorage.getItem(USER));
      setUsers(res.data.filter((user) => user.id !== admin.id));
    } catch (error) {
      console.error("Error fetching users:", error);
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
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;