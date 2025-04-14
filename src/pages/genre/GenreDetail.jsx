import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

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

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">Genre Detail</h1>
            {loading && <LoadingIndicator />}
            {error && <p className="text-red-500 font-inter text-center">{error}</p>}
            {!genre && <p className="text-soft-gray font-inter text-center">Genre not found.</p>}
            {genre && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                        <h1 className="text-4xl font-semibold text-forest mb-4 font-inter">{genre.name}</h1>
                        <p className="text-lg text-soft-gray font-inter">{genre.description}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-forest mb-4 font-inter">Books in {genre.name}</h3>
                        {genreBooks && genreBooks.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {genreBooks.map((book) => (
                                    <Link
                                        key={book.id}
                                        to={`/books/${book.id}`}
                                        className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-all"
                                    >
                                        {book.cover_image ? (
                                            <img
                                                src={book.cover_image}
                                                alt={book.title}
                                                className="w-full h-32 object-contain rounded-md mb-2"
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-soft-gray rounded-md mb-2" />
                                        )}
                                        <h4 className="text-sm font-semibold text-forest font-inter truncate">{book.title}</h4>
                                        <p className="text-xs text-soft-gray font-inter">{book.published_year}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-soft-gray font-inter">No books available for this genre.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default GenreDetail;