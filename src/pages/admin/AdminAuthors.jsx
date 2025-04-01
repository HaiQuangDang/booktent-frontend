import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AuthorForm from "../../components/admin/AuthorForm";
import { Link } from "react-router-dom";

function AdminAuthors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await api.get("/books/authors/");
                setAuthors(res.data);
            } catch (error) {
                console.error("Error fetching authors:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    const handleEdit = (author) => {
        setSelectedAuthor(author);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this author?")) {
            try {
                await api.delete(`/books/authors/${id}/`);
                alert("Delete author successfully!")
                setAuthors(authors.filter(author => author.id !== id));
            } catch (error) {
                console.error("Error deleting author:", error);
            }
        }
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedAuthor(null);
    };

    const handleFormSubmit = (newAuthor) => {
        if (selectedAuthor) {
            setAuthors(authors.map(author => (author.id === newAuthor.id ? newAuthor : author)));
        } else {
            setAuthors([...authors, newAuthor]);
        }
        handleFormClose();
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="flex">
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Manage Authors</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => setIsFormOpen(true)}>
                    Add Author
                </button>
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {authors.map(author => (
                                <tr key={author.id} className="border-t">
                                    <td className="p-3">{author.id}</td>
                                    <td className="p-3">
                                        <Link to={`/author/${author.id}`} className="text-blue-500 hover:underline">
                                            {author.name}
                                        </Link>
                                    </td>
                                    <td className="p-3">
                                        <button className="text-blue-500 hover:underline mr-2" onClick={() => handleEdit(author)}>Edit</button>
                                        <button className="text-red-500 hover:underline" onClick={() => handleDelete(author.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {isFormOpen && <AuthorForm author={selectedAuthor} onClose={handleFormClose} onSubmit={handleFormSubmit} />}
            </div>
        </div>
    );
}

export default AdminAuthors;
