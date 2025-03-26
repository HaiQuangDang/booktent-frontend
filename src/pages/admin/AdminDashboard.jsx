import { useEffect, useState } from "react";
import api from "../../api";
import AdminStoreManagement from "../../components/admin/AdminStoreManagement"

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

   

    const fetchUsers = async () => {
        try {
            const res = await api.get("/user/users/");
            setUsers(res.data);
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
        <div>
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AdminStoreManagement />
        </div>
    );
};

export default AdminDashboard;
