import React from "react";
import { Link } from "react-router-dom";

const BookList = ({ books }) => {
    return (
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
    )

}

export default BookList;