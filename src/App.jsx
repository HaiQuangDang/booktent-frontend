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
import StoreOrders from "./pages/stores/StoreOrders";
import StoreOrderDetail from "./pages/stores/StoreOrderDetail";
import StoreDashboard from "./pages/stores/StoreDashboard";

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

// Order
import Cart from "./pages/order/Cart";
import OrderListPage from "./pages/order/OrderListPage";
import OrderDetail from "./pages/order/OrderDetail";
import PlaceOrder from "./pages/order/PlaceOrder";
import OrderSuccess from "./pages/order/OrderSuccess";

// Layout
import Header from "./components/layouts/Header";

// Admin
import AdminRoute from "./components/admin/AdminRoute"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminBooks from "./pages/admin/AdminBooks";


function App() {
  const [user, setUser] = useState(null);
  const [myStore, setMystore] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const fetchData = async () => {
    if (localStorage.getItem(USER)) {
      const storedUser = localStorage.getItem(USER);
      setUser(JSON.parse(storedUser));
      try {
        const myStoreRes = await api.get("/stores/mine/");
        if (myStoreRes.data && !myStoreRes.data.detail) {
          setMystore(myStoreRes.data);
        }
        // fetch amount of cart items
        const cartRes = await api.get("/cart/");
        setCartItemCount(cartRes.data.items.length);
      } catch (error) {
        console.error("Failed to load data.", error);
      }
    }
  };

  function Logout() {
    localStorage.clear();
    setUser(null);
    setMystore(null);
    return <Navigate to="/" />;
  }

  function RegisterAndLogout() {
    localStorage.clear();
    setUser(null);
    setMystore(null);
    return <Register />;
  }

  const isAuthenticated = () => !!localStorage.getItem(ACCESS_TOKEN);


  useEffect(() => {
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

          {/* Admin */}

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/stores" element={<AdminRoute><AdminStores /></AdminRoute>} />
          <Route path="/admin/books" element={<AdminRoute><AdminBooks /></AdminRoute>} />


          {/* Stores */}
          <Route path="/dashboard" element={<ProtectedRoute><StoreDashboard /></ProtectedRoute>} />
          <Route path="/store/create" element={<CreateStore />} />
          <Route path="/store/orders" element={<ProtectedRoute><StoreOrders /></ProtectedRoute>} />
          <Route path="/store/:id" element={<StoreDetails />} />
          <Route path="/store/:id/edit" element={<EditStorePage />} />
          <Route path="/store/orders/:orderId" element={<ProtectedRoute><StoreOrderDetail /></ProtectedRoute>} />


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

          {/* Order */}
          <Route path="/cart" element={<ProtectedRoute><Cart updateCartItemCount={updateCartItemCount} /></ProtectedRoute>} />
          <Route path="/orders/list" element={<ProtectedRoute><OrderListPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
          <Route path="/place-order/" element={<ProtectedRoute><PlaceOrder updateCartItemCount={updateCartItemCount} /></ProtectedRoute>} />
          <Route path="/orders/success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;