import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { ACCESS_TOKEN, USER } from "./constants";
import api from "./api";

// Authentication
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Stores
// import StoresPage from "./pages/stores/StoresPage";
import CreateStore from "./pages/stores/CreateStore";
import StoreDetails from "./pages/stores/StoreDetails";
import EditStorePage from "./pages/stores/EditStorePage";

// Books
// import BookManager from "./pages/books/BookManager";
import BookDetail from "./pages/books/BookDetail";
import EditBookPage from "./pages/books/EditBookPage";
import AddBookPage from "./pages/books/AddBookPage";

// Authors
import AuthorDetail from "./pages/author/AuthorDetail";

// Genres
import GenreDetail from "./pages/genre/GenreDetail";

// User
import Profile from "./pages/user/Profile"
import Setting from "./pages/user/Setting";

// Cart
import Cart from "./pages/cart/Cart";

// Layout
import Header from "./components/layouts/Header";

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

const isAuthenticated = () => !!localStorage.getItem(ACCESS_TOKEN);

function App() {
  const [user, setUser] = useState(null);
  const [myStore, setMystore] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem(USER)) {
        const storedUser = localStorage.getItem(USER);
        setUser(JSON.parse(storedUser));
        console.log("storeUser", JSON.parse(storedUser))
        try {
          const myStoreRes = await api.get("/stores/mine/");
          if (myStoreRes.data && !myStoreRes.data.detail) {
            setMystore(myStoreRes.data);
            console.log("My store: ", myStoreRes.data)
          }
          // fetch amount of cart items
          const cartRes = await api.get("/cart/");
          setCartItemCount(cartRes.data.items.length);
          console.log("Items: ", cartRes.data.items.length)
        } catch (error) {
          console.error("Failed to load data.", error);
        }
      }
    };

    fetchData();
  }, []);

  const updateCartItemCount = async () => {
    try {
      const cartRes = await api.get("/cart/");
      setCartItemCount(cartRes.data.items.length);
    } catch (error) {
      console.log("Failed to fetch cart count.");
    }
  };

  return (
    <>
      <BrowserRouter>
        <Header user={user} myStore={myStore} cartItemCount={cartItemCount} />
        <Routes>


          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <RegisterAndLogout />} />
          <Route path="/logout" element={<Logout />} />

          {/* Stores */}
          <Route path="/store/create" element={<CreateStore />} />
          <Route path="/store/:id" element={<StoreDetails />} />
          <Route path="/store/:id/edit" element={<EditStorePage />}
          />

          {/* Books */}
          <Route path="/books/:id" element={<BookDetail updateCartItemCount={updateCartItemCount} />} />
          <Route path="/books/:id/edit" element={<EditBookPage />} />
          <Route path="/books/add" element={<AddBookPage />} />

          {/* Authors */}
          <Route path="/author/:id" element={<AuthorDetail />} />

          {/* Genres */}
          <Route path="/genre/:id" element={<GenreDetail />} />

          {/* User */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />

          {/* Cart */}
          <Route path="/cart" element={<ProtectedRoute><Cart updateCartItemCount={updateCartItemCount}/></ProtectedRoute>} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;