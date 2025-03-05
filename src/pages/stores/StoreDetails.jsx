import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../../constants";
import BookOwn from "../../components/stores/BookOwn";

function StoreDetails() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const res = await api.get(`/stores/${id}/`);
                setStore(res.data);
            } catch (err) {
                setError("Store not found");
            } finally {
                setLoading(false);
            }
        };
        const fetchUsername = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token) {
                const decoded = jwtDecode(token);
                try {
                    const res = await api.get(`/user/me/`); // Fetch user details
                    console.log(res)
                    setUsername(res.data.username); // Store the username
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        fetchStore();
        fetchUsername();

    }, [id]);

    // my version
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete your store?")) return;

        try {
            await api.delete(`/store/${id}/`);
            alert("Store deleted successfully.");
            navigate("/stores");
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.detail); // Show error message from backend
            } else {
                alert("An error occurred while deleting the user.");
            }
            console.error("Error deleting user:", error);
        }
    };

    if (loading) return <p>Loading store...</p>;
    if (error) return <p>{error}</p>;
    if (!store) return <p>Store not found.</p>;

    return (
        <div className="container mx-auto p-4">
            {/* store info */}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{store.name}</h1>
                <img src={store.logo} alt="Store Logo" className="w-32 h-32 object-cover mb-4" />
                <p className="text-gray-700 mb-2">{store.description}</p>
                <p className="text-gray-700 mb-2"><strong>Contact:</strong> {store.contact_info}</p>
                <p className="text-gray-700 mb-2"><strong>Status:</strong> {store.status}</p>
                <p className="text-gray-700 mb-4"><strong>Created At:</strong> {new Date(store.created_at).toLocaleDateString()}</p>

                {/* Show Edit Button only if user owns the store */}
                {store.owner === username && (
                    <div className="flex space-x-4">
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => navigate(`/store/${id}/edit`)}
                        >
                            Edit Store
                        </button>
                        <button 
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleDelete(store.id)}
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8">
                <BookOwn books={store.books} />
            </div>
        </div>
    );
}

export default StoreDetails;
