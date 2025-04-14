import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN } from "../../constants";
import LoadingIndicator from "../../components/LoadingIndicator";

function BookDetail({ updateCartItemCount }) {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        fetchBook();
        checkIfInCart();
    }, [id]);

    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/book/${id}/`);
            setBook(response.data);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.detail || "Failed to fetch book.");
        }
    };

    const checkIfInCart = async () => {
        if (localStorage.getItem(ACCESS_TOKEN)) {
            try {
                const res = await api.get(`/cart/check/${id}/`);
                setInCart(res.data.exists);
            } catch (error) {
                console.error("Error checking cart status:", error);
            }
        }
    };

    const handleAddToCart = async (bookId) => {
        try {
            if (!localStorage.getItem(ACCESS_TOKEN)) {
               window.confirm("Dear my lovely friend, you need to log in to add items to your cart. Do you want to log in?") && navigate("/login");
                return;
            } else {
                const res = await api.post("/cart/", { book_id: bookId, quantity: 1 });
                checkIfInCart();
                updateCartItemCount();
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Failed to add book to cart.");
        }
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">Book Details</h1>
            {book ? (
                <div className="bg-white shadow-md rounded-lg p-6 flex gap-6">
                    <div className="w-1/3 flex-shrink-0">
                        <img
                            className="w-full max-h-80 object-contain rounded-md"
                            src={book.cover_image}
                            alt={`${book.title} cover`}
                        />
                    </div>
                    <div className="w-2/3 flex flex-col">
                        <h1 className="text-2xl font-semibold text-forest mb-3 font-inter">
                            {book.title}
                        </h1>
                        <p className="text-soft-gray mb-4 font-inter">{book.description}</p>
                        <p className="text-soft-gray mb-2 font-inter">
                            <span className="text-lg text-burnt-orange font-semibold">${book.price}</span>
                        </p>
                        <p className="text-soft-gray mb-2 font-inter">
                            Author:{" "}
                            {book.author_details && book.author_details.length > 0 ? (
                                book.author_details.map((author, index) => (
                                    <span key={author.id || index}>
                                        <Link
                                            to={`/author/${author.id}`}
                                            className="text-forest hover:text-burnt-orange transition-colors"
                                        >
                                            {author.name}
                                        </Link>
                                        {index < book.author_details.length - 1 ? ", " : ""}
                                    </span>
                                ))
                            ) : (
                                "Unknown Author"
                            )}
                        </p>
                        <p className="text-soft-gray mb-2 font-inter">
                            Published: <span className="text-forest">{book.published_year}</span>
                        </p>
                        <p className="text-soft-gray mb-2 font-inter">
                            Genres:{" "}
                            {book.genre_names && book.genres && book.genre_names.length > 0 ? (
                                book.genre_names.map((name, index) => (
                                    <Link
                                        key={index}
                                        to={`/genre/${book.genres[index]}`}
                                        className="text-forest hover:text-burnt-orange transition-colors"
                                    >
                                        {name}
                                        {index < book.genre_names.length - 1 ? ", " : ""}
                                    </Link>
                                ))
                            ) : (
                                "No Genres"
                            )}
                        </p>
                        <p className="text-soft-gray mb-2 font-inter">
                            In stock: <span className="text-forest">{book.stock_quantity ? `${book.stock_quantity} books` : "Out of Stock"}</span>
                        </p>
                        <p className="text-soft-gray mb-4 font-inter">
                            Sold by:{" "}
                            <Link
                                to={`/store/${book.store}`}
                                className="text-forest hover:text-burnt-orange transition-colors"
                            >
                                {book.store_name}
                            </Link>
                        </p>
                        {book.stock_quantity > 0 && (
                            inCart ? (
                                <Link to="/cart" className="mt-auto">
                                    <button className="w-40 bg-soft-gray text-white px-4 py-2 rounded-md hover:bg-forest transition-colors">
                                        IN CART
                                    </button>
                                </Link>
                            ) : (
                                <button
                                    onClick={() => handleAddToCart(book.id)}
                                    className="btn-primary w-40 mt-auto"
                                >
                                    ADD TO CART
                                </button>
                            )
                        )}
                    </div>
                </div>
            ) : (
                !errorMessage && (
                    <div className="flex justify-center items-center min-h-screen">
                        <LoadingIndicator />
                    </div>
                )
            )}
            {errorMessage && <p className="text-red-500 mt-4 text-center font-inter">{errorMessage}</p>}
        </div>
    );
}

export default BookDetail;