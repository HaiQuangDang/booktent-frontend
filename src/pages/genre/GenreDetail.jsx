import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api";

const GenreDetail = () => {
    const { id } = useParams();
    const [genre, setGenre] = useState(null);
    const [genreBooks, setGenreBooks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGenre = async () => {
        try {
            const genreRes = await api.get(`/books/genres/${id}/`);
            setGenre(genreRes.data);
        } catch (err) {
            setError("Genre not found");
        } finally {
            setLoading(false);
        }
    }

    const fetchGenreBooks = async () => {
        try {
            const genreRes = await api.get(`/books/genres/${id}/books/`);
            setGenreBooks(genreRes.data.books);
        } catch (err) {
            setError("Genre's Books not found");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGenre();
        fetchGenreBooks();
    }, [id]);

    if (loading) return <p>Loading genre...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto py-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">{genre.name}</h1>
                <p className="text-lg text-gray-700 mb-6">{genre.description}</p>
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Books</h3>
                    {genreBooks && genreBooks.length > 0 ? (
                        <ul className="space-y-4">
                            {genreBooks.map((book) => (
                                <li key={book.id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                                    <h4 className="text-xl font-bold">
                                        <Link to={`/books/${book.id}`} className="text-blue-600 hover:underline">
                                            {book.title}
                                        </Link>
                                    </h4>
                                    <p className="text-gray-600">{book.author}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No books available for this genre.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default GenreDetail;