import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

const AuthorDetail = () => {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [authorBooks, setAuthorBooks] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuthor = async () => {
        try {
            const authorRes = await api.get(`/books/authors/${id}/`);
            setAuthor(authorRes.data);
        } catch (err) {
            setError("Author not found");
        } finally {
            setLoading(false);
        }
    };

    const fetchAuthorBooks = async () => {
        try {
            const authorRes = await api.get(`/books/authors/${id}/books/`);
            setAuthorBooks(authorRes.data.books);
        } catch (err) {
            setError("Author's Books not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthor();
        fetchAuthorBooks();
    }
        , [id]);

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">Author Details</h1>
            {loading && (
                <div className="flex justify-center items-center min-h-screen bg-beige">
                    <LoadingIndicator />
                </div>
            )}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!author && <p className="text-soft-gray font-inter text-center">Author not found.</p>}
            {author && (
                <>
                    <div className="bg-white shadow-md rounded-lg p-8 mb-8">
                        <div className="flex gap-8">
                            <div className="w-1/3 flex flex-col items-center">
                                <img
                                    src={author.photo}
                                    alt={author.name}
                                    className="w-40 h-40 rounded-full mb-6 border-2 border-forest object-cover transition-transform hover:scale-105"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                />
                            </div>
                            <div className="w-2/3">
                                <h2 className="text-3xl font-semibold text-forest mb-4 font-inter">{author.name}</h2>
                                <p className="text-soft-gray mb-6 font-inter">{author.bio}</p>
                                <div className="space-y-2 text-soft-gray font-inter">
                                    {author.date_of_birth && (
                                        <p>Date of Birth: <span className="font-semibold">{author.date_of_birth}</span></p>
                                    )}
                                    {author.date_of_death && (
                                        <p>Date of Death: <span className="font-semibold">{author.date_of_death}</span></p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-8">
                        <h3 className="text-xl font-semibold text-forest mb-4 font-inter">Books by {author.name}</h3>
                        {authorBooks && authorBooks.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {authorBooks.map((book) => (
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
                                        <h3 className="text-sm font-semibold text-forest font-inter truncate">{book.title}</h3>
                                        <p className="text-xs text-soft-gray font-inter">{book.published_year}</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-soft-gray font-inter">No books available</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default AuthorDetail;