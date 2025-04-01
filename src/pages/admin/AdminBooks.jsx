import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const res = await api.get("/admin/books/");
            setBooks(res.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.patch(`/admin/books/${id}/status/`, { status: newStatus });
            setBooks(books.map(book => book.id === id ? { ...book, status: newStatus } : book));
        } catch (error) {
            console.error("Error updating book status:", error);
        }
    };

    const handleDeleteBook = async (id) => {
        if (window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.delete(`/admin/books/${id}/delete/`);
                setBooks(books.filter(book => book.id !== id));
                alert("Book deleted successfully!");
            } catch (error) {
                console.error("Error deleting book:", error);
            }
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="flex">
            <div className="p-4 w-full">
                <h2 className="text-2xl font-bold mb-4">Manage Books</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Author</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id} className="text-center">
                                <td className="border p-2">{book.id}</td>
                                <td className="border p-2">
                                    <Link to={`/books/${book.id}`} className="text-blue-500 underline">
                                        {book.title}
                                    </Link>
                                </td>
                                <td className="border p-2">{book.authors}</td>
                                <td className="border p-2">
                                    <select
                                        value={book.status}
                                        onChange={(e) => handleUpdateStatus(book.id, e.target.value)}
                                        className="border p-1 rounded"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => handleDeleteBook(book.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminBooks;
