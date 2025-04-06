import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Link } from "react-router-dom";


function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/admin/books/${id}/status/`, { status: newStatus });
      setBooks(books.map((book) => (book.id === id ? { ...book, status: newStatus } : book)));
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/admin/books/${id}/delete/`);
      setBooks(books.filter((book) => book.id !== id));
      alert("Book deleted successfully!");
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="flex">
      <div className="p-6 w-full bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Books</h2>
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Title</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Author</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Status</th>
                <th className="p-4 text-center text-forest font-inter font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                  <td className="p-4 text-soft-gray font-inter">{book.id}</td>
                  <td className="p-4">
                    <Link
                      to={`/books/${book.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-burnt-orange hover:underline font-inter"
                    >
                      {book.title}
                    </Link>
                  </td>
                  <td className="p-4 text-soft-gray font-inter">{book.authors}</td>
                  <td className="p-4">
                    <select
                      value={book.status}
                      onChange={(e) => handleUpdateStatus(book.id, e.target.value)}
                      className="border border-soft-gray px-2 py-1 rounded-md text-soft-gray font-inter focus:outline-none focus:ring-2 focus:ring-forest"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors font-inter"
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
    </div>
  );
}

export default AdminBooks;