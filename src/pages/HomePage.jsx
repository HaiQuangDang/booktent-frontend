import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import BookList from "../components/books/BookList";
``

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
        <BookList books={books} />
      </div>
    </div>
  );
}

export default HomePage;