// src/pages/admin/AdminUsers.jsx
import AdminSidebar from "../../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import api from "../../api";
import {USER} from "../../constants";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);



    const fetchUsers = async () => {
        try {
            const res = await api.get("/user/users/");
            const admin = JSON.parse(localStorage.getItem(USER))
            setUsers(res.data.filter(user => user.id !== admin.id));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await api.delete(`/user/delete/${id}/`);
            alert("Delete user successfully!")
            setUsers(users.filter(user => user.id !== id)); // Update state after deletion
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.detail); // Show error message from backend
            } else {
                alert("An error occurred while deleting the user.");
            }
            console.error("Error deleting user:", error);
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Username</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="border p-2">{user.id}</td>
                                <td className="border p-2">{user.username}</td>
                                <td className="border p-2">{user.email}</td>
                                <td className="border p-2">
                                    <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
