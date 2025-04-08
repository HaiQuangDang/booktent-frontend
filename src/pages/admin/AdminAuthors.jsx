import { useEffect, useState } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
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
    if (!window.confirm("Are you sure you want to delete this author?")) return;

    try {
      await api.delete(`/books/authors/${id}/`);
      alert("Author deleted successfully!");
      setAuthors(authors.filter((author) => author.id !== id));
    } catch (error) {
      console.error("Error deleting author:", error);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAuthor(null);
  };

  const handleFormSubmit = (newAuthor) => {
    if (selectedAuthor) {
      setAuthors(authors.map((author) => (author.id === newAuthor.id ? newAuthor : author)));
    } else {
      setAuthors([...authors, newAuthor]);
    }
    handleFormClose();
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-beige min-h-screen">
        <h2 className="text-3xl font-playfair text-forest mb-6">Manage Authors</h2>
        {!authors.length && (
          <div className="text-center text-soft-gray font-inter">
            No authors found. Please add an author.
          </div>
        )}
       
         
        
        <button
          className="bg-burnt-orange text-white px-4 py-2 rounded-md hover:bg-burnt-orange/80 transition-colors font-inter mb-6"
          onClick={() => setIsFormOpen(true)}
        >
          + Add Author
        </button>
        { authors.length > 0 && (
        <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="p-4 text-left text-forest font-inter font-semibold">ID</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Name</th>
                <th className="p-4 text-left text-forest font-inter font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                  <td className="p-4 text-soft-gray font-inter">{author.id}</td>
                  <td className="p-4">
                    <Link
                      to={`/author/${author.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-burnt-orange hover:underline font-inter"
                    >
                      {author.name}
                    </Link>
                  </td>
                  <td className="p-4">
                    <button
                      className="text-forest hover:underline font-inter mr-4"
                      onClick={() => handleEdit(author)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline font-inter"
                      onClick={() => handleDelete(author.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {isFormOpen && (
          <AuthorForm author={selectedAuthor} onClose={handleFormClose} onSubmit={handleFormSubmit} />
        )}
      </div>
    
    </div>
  );
}

export default AdminAuthors;