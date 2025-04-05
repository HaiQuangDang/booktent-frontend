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
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const storeRes = await api.get(`/stores/${id}/`);
                setStore(storeRes.data);
                // Filter approved books
                const approvedBooks = storeRes.data.books?.filter(book => book.status === "approved") || [];
                setBooks(approvedBooks);

            } catch (err) {
                setError("Store not found");
            } finally {
                setLoading(false);
            }
        };
        fetchStore();

    }, [id]);

    return (
        <div className="container mx-auto p-8 min-h-screen">
            {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
            {error && <p className="text-soft-gray font-inter text-center">{error}</p>}
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
                                    <h1 className="text-3xl text-forest">{store.name}</h1>
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

                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl text-forest mb-2 font-playfair">Books</h1>
                    <BookList books={books} />
                </>
            )}

        </div>
    );
}

export default StoreDetails;
