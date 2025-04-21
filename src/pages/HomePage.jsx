import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import BookList from "../components/books/BookList";
``

function HomePage() {
  const [bestSeller, setBestSeller] = useState([]);
  const [recent, setRecent] = useState([])
   useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const bestSellerRes = await api.get("/books/homepage/");
      const recentRes = await api.get("/books/recent/");
      setBestSeller(bestSellerRes.data);
      setRecent(recentRes.data);

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
        <BookList books={bestSeller} />
        <h1 className="text-4xl text-forest mb-8 mt-8 text-center">
          Recent Books 
        </h1>
        <BookList books={recent} />
      </div>
    </div>
  );
}

export default HomePage;