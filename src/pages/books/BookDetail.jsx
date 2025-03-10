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
    return (
        <div className="container mx-auto p-4">
            {book && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <img
                        className="w-1/2 h-auto max-h-48 object-contain rounded-md mb-4"
                        src={book.cover_image}
                        alt={`${book.title} cover`}
                    />
                    <h1 className="text-2xl font-bold mb-2">Title: {book.title}</h1>
                    <p className="text-gray-700 mb-2">Description: {book.description}</p>
                    <p className="text-gray-700 mb-2">
                        <strong>Authors:</strong>{" "}
                        {book.author_names.map((name, index) => (
                            <span key={book.authors[index]}>
                                <Link
                                    to={`/author/${book.authors[index]}`}
                                    className="text-blue-500 hover:text-blue-700 hover:underline transition duration-300"
                                >
                                    {name}
                                </Link>
                                {index < book.author_names.length - 1 ? ", " : ""}
                            </span>
                        ))}
                    </p>
                    <p className="text-gray-700 mb-2">Published Year: {book.published_year}</p>
                    <p className="text-gray-700 mb-2">Price: ${book.price}</p>
                    <p className="text-gray-700 mb-2">Stock: {book.stock_quantity ? book.stock_quantity + " books" : "Out of Stock"}</p>
                    <p className="text-gray-700 mb-2">
                        Sold by:{" "}
                        <Link
                            to={`/store/${book.store}`}
                            className="text-blue-500 hover:text-blue-700 hover:underline transition duration-300"
                        >
                            {book.store_name}
                        </Link>
                    </p>
                </div>
            )}

            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
    );
}

export default BookDetail;