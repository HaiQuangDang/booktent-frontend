import { useState, useEffect } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import AdminSidebar from "../../components/admin/AdminSidebar";
import GenreForm from "../../components/admin/GenreForm";
import { Link } from "react-router-dom";

function AdminGenres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const res = await api.get("/books/genres/");
            setGenres(res.data);
        } catch (error) {
            console.error("Error fetching genres:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (genreData) => {
        try {
            if (selectedGenre && selectedGenre.id) {  // Check if it has an `id` before updating
                await api.put(`/books/genres/${selectedGenre.id}/`, genreData);
                setSuccessMessage("Genre updated successfully!");
            } else {
                await api.post("/books/genres/", genreData);  // If no `id`, it's a new genre
                setSuccessMessage("Genre added successfully!");
            }
            setErrorMessage("");
            fetchGenres(); // Refresh list
        } catch (error) {
            setErrorMessage("Failed to save genre. Please try again.");
            setSuccessMessage("");
        }
        setSelectedGenre(null);
    };
    
    const handleDelete = async (genreId) => {
        if (!window.confirm("Are you sure you want to delete this genre?")) return;
        try {
            await api.delete(`/books/genres/${genreId}/`);
            setSuccessMessage("Genre deleted successfully!");
            setErrorMessage("");
            fetchGenres(); // Refresh list
        } catch (error) {
            setErrorMessage("Failed to delete genre.");
            setSuccessMessage("");
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="flex">
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                <h2 className="text-2xl font-semibold mb-4">Manage Genres</h2>

                {successMessage && <div className="bg-green-100 text-green-800 p-2 rounded">{successMessage}</div>}
                {errorMessage && <div className="bg-red-100 text-red-800 p-2 rounded">{errorMessage}</div>}

                <button onClick={() => setSelectedGenre({})} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                    + Add Genre
                </button>

                {selectedGenre && (
                    <GenreForm
                        genre={selectedGenre}
                        onSave={handleSave}
                        onCancel={() => setSelectedGenre(null)}
                    />
                )}

                <div className="bg-white p-4 rounded-xl shadow-md">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres.map(genre => (
                                <tr key={genre.id} className="border-t">
                                    <td className="p-3">
                                        
                                        <Link to={`/genre/${genre.id}`} className="text-blue-500 hover:underline">
                                        {genre.name}
                                        </Link>
                                    </td>
                                    <td className="p-3">{genre.description}</td>
                                    <td className="p-3">
                                        <button onClick={() => setSelectedGenre(genre)} className="text-blue-500 mr-2">Edit</button>
                                        <button onClick={() => handleDelete(genre.id)} className="text-red-500">Delete</button>
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

export default AdminGenres;
