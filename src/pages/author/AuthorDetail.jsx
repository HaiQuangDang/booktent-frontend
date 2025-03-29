import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Link } from "react-router-dom";

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

    if (loading) return <p>Loading author...</p>;
    if (error) return <p>{error}</p>; 

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Author Details</h1>
            <div className="bg-white shadow-lg rounded-lg p-8">
                {author.photo && (
                    <div className="flex justify-center mb-6">
                        <img 
                            src={author.photo} 
                            alt={author.name} 
                            className="w-32 h-32 rounded-full object-cover" 
                            onError={(e) => e.target.src = 'default-photo-url.jpg'} 
                        />
                    </div>
                )}
                <h2 className="text-3xl font-semibold text-center mb-4">{author.name}</h2>
                <p className="text-gray-700 text-center mb-6">{author.bio}</p>
                <div className="text-center">
                    {author.date_of_birth && (
                        <p className="text-gray-600 mb-2">Date of Birth: {author.date_of_birth}</p>
                    )}
                    {author.date_of_death && (
                        <p className="text-gray-600 mb-2">Date of Death: {author.date_of_death}</p>
                    )}
                </div>
                <div>
                    <h3 className="text-2xl font-semibold mb-4">Books</h3>
                    <ul className="list-disc list-inside">
                        {authorBooks && authorBooks.length > 0 ? (
                            authorBooks.map((book) => (
                                <li key={book.id} className="mb-2">
                                    <Link to={`/books/${book.id}`} className="text-lg font-medium text-blue-500 hover:underline">
                                        {book.title}
                                    </Link>
                                    <p className="text-gray-600">{book.published_year}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-600">No books available</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AuthorDetail;