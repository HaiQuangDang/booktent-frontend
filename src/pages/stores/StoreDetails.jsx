import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { USER } from "../../constants";
import BookOwn from "../../components/stores/BookOwn";
import BookList from "../../components/books/BookList";
import { Link } from "react-router-dom";

// This is for customer view

function StoreDetails() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [username, setUsername] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const storeRes = await api.get(`/stores/${id}/`);
                setStore(storeRes.data);
                console.log("store", storeRes.data);
                const user = JSON.parse(localStorage.getItem(USER)); // ✅ Parse it
                console.log("user", user);

                if (user && user.username === storeRes.data.owner) { // ✅ Ensure user exists
                    setIsOwner(true);
                }
            } catch (err) {
                setError("Store not found");
            } finally {
                setLoading(false);
            }
        };
        fetchStore();

    }, [id]);


    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete your store?")) return;

        try {
            await api.delete(`/stores/${id}/`);
            alert("Store deleted successfully.");
            navigate("/");
            window.location.reload()
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    console.log(store)
    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">
                Store Details
            </h1>
            {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
            {!store && <p className="text-soft-gray font-inter text-center">Store not found.</p>}
            {store && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                        <div className="flex gap-8">
                            <div className="w-1/3 flex flex-col items-center">
                                <img
                                    src={store.logo || "https://via.placeholder.com/150"}
                                    alt="Store Logo"
                                    className="w-48 h-48 object-cover rounded-md mb-6 border-2 border-forest transition-transform hover:scale-105"
                                />
                            </div>
                            <div className="w-2/3">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-3xl font-semibold text-forest">{store.name}</h1>
                                    <span
                                        className={`text-lg font-semibold px-4 py-1 rounded-md font-inter ${store.status === "active" ? "bg-forest text-white" : "bg-soft-gray text-forest"
                                            }`}
                                    >
                                        {store.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="space-y-2 text-soft-gray font-inter">
                                    <p>{store.description}</p>
                                    <p><strong className="text-forest">Contact:</strong> {store.contact_info}</p>
                                    <p><strong className="text-forest">Created At:</strong> {new Date(store.created_at).toLocaleDateString()}</p>
                                </div>
                                {isOwner && (
                                    <div className="flex gap-4 mt-6">
                                        <button
                                            className="flex-1 bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter"
                                            onClick={() => navigate(`/store/orders-list`)}
                                        >
                                            Orders Management
                                        </button>
                                        <button
                                            className="flex-1 bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter"
                                            onClick={() => navigate(`/store/${id}/edit`)}
                                        >
                                            Edit Store
                                        </button>
                                        <button
                                            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-inter"
                                            onClick={() => handleDelete(store.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="bg-white shadow-md rounded-lg p-8">
                            <h3 className="text-xl font-semibold text-forest mb-4 font-inter">Manage Your Store</h3>
                            <Link to={store.status === "active" ? "/books/add" : "#"}>
                                <button
                                    className={`px-4 py-2 rounded-md font-inter transition-colors ${store.status === "active"
                                        ? "bg-forest text-white hover:bg-burnt-orange"
                                        : "bg-soft-gray text-forest cursor-not-allowed"
                                        }`}
                                    disabled={store.status !== "active"}
                                >
                                    Add Book
                                </button>
                            </Link>
                        </div>
                    )}

                    <h1 className="text-3xl font-semibold text-forest mb-2">Books</h1>
                    <BookList books={store.books} />
                </>
            )}

        </div>
    );
}

export default StoreDetails;
