import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../../constants";

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
                const res = await api.get(`/store/${id}/`);
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
        <div>
            <h1>{store.name}</h1>
            <img src={store.logo} alt="Store Logo" width="150" />
            <p>{store.description}</p>
            <p><strong>Contact:</strong> {store.contact_info}</p>
            <p><strong>Status:</strong> {store.status}</p>
            <p><strong>Created At:</strong> {new Date(store.created_at).toLocaleDateString()}</p>


            {/* Show Edit Button only if user owns the store */}
            {store.owner === username && (
                <button onClick={() => navigate(`/store/${id}/edit`)}>Edit Store</button>
            )}

            {/* Show Edit Button only if user owns the store */}
            {store.owner === username && (
                <button style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDelete(store.id)}>Delete</button>
            )}
        </div>
    );
}

export default StoreDetails;
