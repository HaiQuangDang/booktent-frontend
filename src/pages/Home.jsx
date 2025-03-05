import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { USER } from "../constants";
import api from "../api";
import Header from "../components/layouts/Header";
import BookList from "../components/books/BookList";

function Home() {
  const [user, setUser] = useState(null);
  const [myStore, setMystore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyStore = async () => {
      const storedUser = localStorage.getItem(USER);
      if (!storedUser) {
        setLoading(false);
        return;
      }
      setUser(JSON.parse(storedUser));
      try {
        const myStoreRes = await api.get("/stores/mine/");
        if (myStoreRes.data && !myStoreRes.data.detail) {
          setMystore(myStoreRes.data);
        }
      } catch (error) {
        setError("Failed to load store data.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyStore();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Header user={user} myStore={myStore} />
      <h1>Welcome! {user ? user.username : "Guest"}</h1>
      {error && <p>{error}</p>}
      <BookList />
    </div>
  );
}

export default Home;