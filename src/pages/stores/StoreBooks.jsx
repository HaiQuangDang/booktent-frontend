import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api";


const StoreBooks = () => {
    const [books, setBooks] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [showGenreRequest, setShowGenreRequest] = useState(false);
    const [genreRequest, setGenreRequest] = useState({ name: "", description: "" });

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
    const handleGenreRequestChange = (e) => {
        setGenreRequest({ ...genreRequest, [e.target.name]: e.target.value });
    };

    const handleGenreRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/books/genres-request/", genreRequest);
            alert("Genre request has been sent successfully.");
            setGenreRequest({ name: "", description: "" });
            setShowGenreRequest(false);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to submit genre request.");
        }
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">Books</h1>

            <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center gap-4">
                <div className="flex gap-4">
                    <Link to="/books/add">
                        <button className="bg-forest text-white px-5 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter">
                            + Add Book
                        </button>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setShowGenreRequest(!showGenreRequest)} // Toggle visibility
                        className="bg-forest text-white px-5 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter"
                    >
                        {showGenreRequest ? "Hide Genre Request" : "Request New Genre"}
                    </button>
                </div>
                <div>
                    <select
                        className="p-2 border border-soft-gray rounded-md bg-white text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {showGenreRequest && (
                <div className="max-w-4xl mx-auto my-6 bg-white rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-forest mb-4 font-inter">Request New Genre</h2>
                    <form onSubmit={handleGenreRequestSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="genre_name" className="block text-sm font-medium text-forest font-inter">
                                Genre Name
                            </label>
                            <input
                                id="genre_name"
                                type="text"
                                name="name"
                                value={genreRequest.name}
                                onChange={handleGenreRequestChange}
                                placeholder="e.g., Cyberpunk"
                                required
                                className="mt-1 w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
                            />
                        </div>
                        <div>
                            <label htmlFor="genre_description" className="block text-sm font-medium text-forest font-inter">
                                Description (optional)
                            </label>
                            <textarea
                                id="genre_description"
                                name="description"
                                value={genreRequest.description}
                                onChange={handleGenreRequestChange}
                                placeholder="Describe the genre"
                                className="mt-1 w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter"
                            >
                                Submit Request
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowGenreRequest(false)}
                                className="flex-1 bg-soft-gray text-forest px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-inter"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg max-w-4xl mx-auto overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-forest text-white font-inter">
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
                                <tr key={book.id} className="border-b hover:bg-beige transition-colors">
                                    <td className="p-4 align-middle">
                                        {book.cover_image ? (
                                            <img
                                                src={book.cover_image}
                                                alt={`${book.title} cover`}
                                                className="w-12 h-16 object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-12 h-16 bg-soft-gray rounded-md" />
                                        )}
                                    </td>
                                    <td className="p-4 align-middle font-semibold text-forest font-inter">{book.title}</td>
                                    <td className="p-4 align-middle text-burnt-orange font-semibold font-inter">${book.price}</td>
                                    <td className="p-4 align-middle text-soft-gray font-inter">{book.stock_quantity}</td>
                                    <td className="p-4 align-middle">
                                        <span
                                            className={`px-2 py-1 rounded-md text-sm font-medium font-inter text-white ${book.status === "approved"
                                                ? "bg-forest"
                                                : book.status === "pending"
                                                    ? "bg-burnt-orange"
                                                    : "bg-red-500"
                                                }`}
                                        >
                                            {book.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle flex justify-center gap-3">
                                        <Link to={`/books/${book.id}/edit`}>
                                            <button className="bg-forest text-white px-3 py-1 rounded-md hover:bg-burnt-orange transition-colors font-inter">
                                                Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-inter"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-6 text-center text-soft-gray font-inter">
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