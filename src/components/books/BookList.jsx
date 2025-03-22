import React, { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }
    , []);

  // Fetch books
  const fetchBooks = async () => {
    try {
      const response = await api.get("/books/homepage/");
      setBooks(response.data);
    } catch (err) {
      console.log(err.response?.data?.detail || "Failed to refresh books.");
    }
  };

  console.log(books);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link key={book.id} to={`/books/${book.id}`}>
            <div className="bg-white shadow-md rounded-lg p-4 border">
            {book.cover_image && (
              <img
                src={book.cover_image}
                alt={`${book.title} cover`}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            )}
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-gray-600">Price: ${book.price}</p>
            <p className="text-gray-500 text-sm">Stock: {book.stock_quantity ? book.stock_quantity + " books" : "Out of Stock"}</p>
            <p className="text-gray-800 text-sm">Sold by: {book.store_name}</p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default BookList;