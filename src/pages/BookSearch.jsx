import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import BookList from "../components/books/BookList";
import LoadingIndicator from "../components/LoadingIndicator";

const BookSearch = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get("q") || "";

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!searchTerm) return;
            setLoading(true);
            try {
                const response = await api.get(`/books/search/?q=${searchTerm}`);
                setBooks(response.data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [searchTerm]);

    return (
        <div className="p-4">
            <h1 className="text-2xl text-forest mb-8 text-center">
                Search Results for "{searchTerm}"
            </h1>
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <LoadingIndicator />
                </div>
            ) : books.length === 0 ? (
                <div className="text-center text-gray-500">No results found.</div>
            ) : (
                <BookList books={books} />
            )}
        </div>
    );
};

export default BookSearch;
