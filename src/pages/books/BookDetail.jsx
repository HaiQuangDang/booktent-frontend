import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";


function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchBook();
    }
    , []);  

    const fetchBook = async () => {
        try {
            const response = await api.get(`/books/book/${id}/`);
            console.log(response)
            setBook(response.data);
        } catch (error) {
            console.log(error);
            setErrorMessage(error.response?.data?.detail || "Failed to fetch book.")
        }
    }

    return (
        <div>
           { book ? (
            <div>
                <h1>Title: {book.title}</h1>
                <p>Desciption: {book.desciption}</p>
                <p>Author: {book.authors}</p>
                <p>Price: {book.price}</p>
                <p>Publish Year: {book.published_year}</p>
                <p>Sold by: {book.store_name}</p>
                <p>Status: {book.stock_quantity} books available</p>

            </div>
            
           ) : (
            <p>Error: {errorMessage}</p>
           )
           }
        </div>
    );
}

export default BookDetail;