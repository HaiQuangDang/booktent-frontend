import React from "react";
import { Link } from "react-router-dom";

const BookOwn = ({ books, isOwner }) => {

  console.log(books);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id}>
            <Link to={`/books/${book.id}`}>
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
                <p className="text-gray-500 text-sm">Stock: {book.stock_quantity}</p>
              </div>
            </Link>
            {isOwner && (
              <div className="mt-4 flex space-x-2">
                <Link to={`/books/${book.id}/edit`}>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                </Link>
                <button
                  // onClick={() => handleDelete(book.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default BookOwn;