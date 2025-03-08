import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBook();
    }, []);

    // fetch store's book
    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/book/${id}/`);
            setBook(response.data);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.detail || "Failed to fetch book.")
        }
    }

    // Delete a book
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.delete(`/books/book/${id}/`);
                navigate("/");
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to delete book.");
            }
        }
    };
    return (
        <div className="container mx-auto p-4">
            {book ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <img
                        className="w-1/2 h-auto max-h-48 object-contain rounded-md mb-4"
                        src={book.cover_image}
                        alt={`${book.title} cover`}
                    />
                    <h1 className="text-2xl font-bold mb-2">Title: {book.title}</h1>
                    <p className="text-gray-700 mb-2">Description: {book.description}</p>
                    <p className="text-gray-700 mb-2">Author: {book.authors}</p>
                    <p className="text-gray-700 mb-2">Price: ${book.price}</p>
                    <p className="text-gray-700 mb-2">Publish Year: {book.published_year}</p>
                    <p className="text-gray-700 mb-2">Sold by: {book.store_name}</p>
                    <p className="text-gray-700 mb-2">Status: {book.stock_quantity} books available</p>
                    <div className="mt-4 flex space-x-2">
                        <Link to={`/books/${book.id}/edit`}>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Edit
                            </button>
                        </Link>
                        <button
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-red-500">Error: {errorMessage}</p>
            )}


        </div>
    );
}

export default BookDetail;