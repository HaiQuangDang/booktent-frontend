import { useState, useEffect } from "react";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";
import GenreForm from "../../components/admin/GenreForm";
import { Link } from "react-router-dom";

function AdminGenres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenre, setSelectedGenre] = useState(null);

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
            if (selectedGenre && selectedGenre.id) {  // Update existing genre
                await api.put(`/books/genres/${selectedGenre.id}/`, genreData);
                alert("Genre updated successfully!");
            } else {  // Add new genre
                await api.post("/books/genres/", genreData);
                alert("Genre added successfully!");
            }
            fetchGenres(); // Refresh list
        } catch (error) {
            alert("Failed to save genre. Please try again.");
        }
        setSelectedGenre(null);  // Close the modal after saving
    };

    const handleDelete = async (genreId) => {
        if (!window.confirm("Are you sure you want to delete this genre?")) return;
        try {
            await api.delete(`/books/genres/${genreId}/`);
            alert("Genre deleted successfully!");
            fetchGenres(); // Refresh list
        } catch (error) {
            alert("Failed to delete genre.");
        }
    };


    if (loading) return <LoadingIndicator />;

    return (
        <div className="flex">
            <div className="flex-1 p-6 bg-beige min-h-screen">
                <h2 className="text-3xl font-playfair text-forest mb-6">Manage Genres</h2>

                <button
                    onClick={() => setSelectedGenre({})}
                    className="bg-burnt-orange text-white px-4 py-2 rounded-md hover:bg-burnt-orange/80 transition-colors font-inter mb-6"
                >
                    + Add Genre
                </button>

                {selectedGenre && (
                    <GenreForm
                        genre={selectedGenre}
                        onSubmit={handleSave}  // Use onSubmit to handle both add and update
                        onClose={() => setSelectedGenre(null)}  // Close the modal after submit or cancel
                    />
                )}

                <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-forest/10">
                                <th className="p-4 text-left text-forest font-inter font-semibold">Name</th>
                                <th className="p-4 text-left text-forest font-inter font-semibold">Description</th>
                                <th className="p-4 text-left text-forest font-inter font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {genres.map((genre) => (
                                <tr key={genre.id} className="border-b border-soft-gray/50 hover:bg-forest/5 transition-colors">
                                    <td className="p-4">
                                        <Link
                                            to={`/genre/${genre.id}`}
                                            className="text-burnt-orange hover:underline font-inter"
                                        >
                                            {genre.name}
                                        </Link>
                                    </td>
                                    <td className="p-4 text-soft-gray font-inter">{genre.description}</td>
                                    <td className="p-4">
                                        <button
                                            className="text-forest hover:underline font-inter mr-4"
                                            onClick={() => setSelectedGenre(genre)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="text-red-500 hover:underline font-inter"
                                            onClick={() => handleDelete(genre.id)}
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

export default AdminGenres;
