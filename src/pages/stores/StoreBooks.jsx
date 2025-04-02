import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";


const StoreBooks = () => {
    const [books, setBooks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all"); // Default: Show all books

    // Filter books based on status
    const filteredBooks =
        filterStatus === "all" ? books : books.filter((book) => book.status === filterStatus);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const storeRes = await api.get(`/stores/mine/`);
                setBooks(storeRes.data.books);
            } catch (err) {
                setError("Store not found");
            }
        };
        fetchBooks();
    }, []);

    // Delete a book
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.delete(`/books/book/${id}/`);
                alert("Book deleted successfully.");
                window.location.reload();
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.detail || "Failed to delete book.");
            }
        }
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
             <h1 className="text-4xl text-forest mb-8 text-center">Store Books</h1>
            {/* Add Book Button */}
            <Link to="/books/add">
                <button className="btn-primary px-5 py-3">+ Add Book</button>
            </Link>

            {/* Filter Dropdown */}
            <div className="flex justify-end mb-4">
                <select
                    className="px-4 py-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-forest"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Books List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-soft-gray text-white">
                        <tr>
                            <th className="p-4">Cover</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <tr key={book.id} className="border-b hover:bg-gray-100 transition text-center">
                                    {/* Cover Image */}
                                    <td className="p-4 align-middle">
                                        {book.cover_image && (
                                            <img
                                                src={book.cover_image}
                                                alt={`${book.title} cover`}
                                                className="w-16 h-20 object-cover rounded-md"
                                            />
                                        )}
                                    </td>

                                    {/* Book Details */}
                                    <td className="p-4 align-middle font-semibold">{book.title}</td>
                                    <td className="p-4 align-middle text-burnt-orange font-semibold">${book.price}</td>
                                    <td className="p-4 align-middle">{book.stock_quantity}</td>

                                    {/* Status with Color Variations */}
                                    <td className="p-4 align-middle">
                                        <span
                                            className={`px-3 py-1 rounded-md text-white text-sm font-medium ${book.status === "approved"
                                                    ? "bg-green-500"
                                                    : book.status === "pending"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                        >
                                            {book.status.toUpperCase()}
                                        </span>
                                    </td>

                                    {/* Actions (Now Fully Aligned) */}
                                    <td className="p-4 align-middle flex justify-center space-x-3">
                                        <Link to={`/books/${book.id}/edit`}>
                                            <button className="btn-primary">Edit</button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-gray-500">
                                    No books found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

}

export default StoreBooks;