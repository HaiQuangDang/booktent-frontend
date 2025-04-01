import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

function HomePage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get("/books/homepage/");
      setBooks(response.data);
    } catch (err) {
      console.log(err.response?.data?.detail || "Failed to refresh books.");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl text-forest mb-8 text-center">
          Best Sellers
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`} className="block">
              <div className="book-card p-3 h-80 flex flex-col">
                {book.cover_image && (
                  <img
                    src={book.cover_image}
                    alt={`${book.title} cover`}
                    className="w-full max-h-48 object-contain rounded-md mb-3"
                  />
                )}
                <h2 className="text-lg font-semibold text-forest mb-2 line-clamp-2 flex-shrink-0 font-roboto">
                  {book.title}
                </h2>
                <p className="text-soft-gray text-sm mt-auto">
                  <span className="text-burnt-orange font-semibold">${book.price}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;