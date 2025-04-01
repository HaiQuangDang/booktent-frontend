import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import { ACCESS_TOKEN, USER } from "./constants";
// Components
import Header from "./components/layouts/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";

// Pages
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";

// Store Pages
import CreateStore from "./pages/stores/CreateStore";
import StoreDetails from "./pages/stores/StoreDetails";
import EditStorePage from "./pages/stores/EditStorePage";
import StoreOrders from "./pages/stores/StoreOrders";
import StoreOrderDetail from "./pages/stores/StoreOrderDetail";
import StoreDashboard from "./pages/stores/StoreDashboard";

// Book Pages
import BookDetail from "./pages/books/BookDetail";
import EditBookPage from "./pages/books/EditBookPage";
import AddBookPage from "./pages/books/AddBookPage";

// Other Detail Pages
import AuthorDetail from "./pages/author/AuthorDetail";
import GenreDetail from "./pages/genre/GenreDetail";

// User Pages
import Profile from "./pages/user/Profile";
import Setting from "./pages/user/Setting";

// Order Pages
import Cart from "./pages/order/Cart";
import OrderList from "./pages/order/OrderList";
import OrderDetail from "./pages/order/OrderDetail";
import PlaceOrder from "./pages/order/PlaceOrder";
import OrderSuccess from "./pages/order/OrderSuccess";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminTransactionDetail from "./pages/admin/AdminTransactionDetail";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminGenres from "./pages/admin/AdminGenres";

function MainAppContent({ user, myStore, cartItemCount, setUser, setMyStore, updateCartItemCount }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const isAuthenticated = () => !!localStorage.getItem(ACCESS_TOKEN);

  const Logout = ({ setUser, setMyStore }) => {
    const navigate = useNavigate();

    useEffect(() => {
      const handleLogout = () => {
        localStorage.clear(); // Clear all localStorage
        setUser(null);        // Reset user state
        setMyStore(null);     // Reset store state
        navigate("/");        // Navigate to home
        window.location.reload(); // Force a full page refresh
      };

      handleLogout();
    }, [setUser, setMyStore, navigate]);

    return null; // No need to render anything since we're redirecting
  };

  const RegisterAndLogout = () => {
    localStorage.clear();
    setUser(null);
    setMyStore(null);
    return <Register />;
  };

  return (
    <>
      {!isAdminRoute && (
        <Header user={user} myStore={myStore} cartItemCount={cartItemCount} />
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated() ? <Navigate to="/" /> : <RegisterAndLogout />
          }
        />
        <Route path="/logout" element={<Logout setUser={setUser} setMyStore={setMyStore} />} />

        {/* Store Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StoreDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/store/create" element={<CreateStore />} />
        <Route path="/store/:id" element={<StoreDetails />} />
        <Route path="/store/:id/edit" element={<EditStorePage />} />
        <Route
          path="/store/orders"
          element={
            <ProtectedRoute>
              <StoreOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/store/orders/:orderId"
          element={
            <ProtectedRoute>
              <StoreOrderDetail />
            </ProtectedRoute>
          }
        />

        {/* Book Routes */}
        <Route
          path="/books/:id"
          element={<BookDetail updateCartItemCount={updateCartItemCount} />}
        />
        <Route path="/books/:id/edit" element={<EditBookPage />} />
        <Route path="/books/add" element={<AddBookPage />} />

        {/* Detail Routes */}
        <Route path="/author/:id" element={<AuthorDetail />} />
        <Route path="/genre/:id" element={<GenreDetail />} />

        {/* User Routes */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/setting" element={<Setting />} />

        {/* Order Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart updateCartItemCount={updateCartItemCount} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/list"
          element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder updateCartItemCount={updateCartItemCount} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />
                <Route
                  path="stores"
                  element={
                    <AdminRoute>
                      <AdminStores />
                    </AdminRoute>
                  }
                />
                <Route
                  path="books"
                  element={
                    <AdminRoute>
                      <AdminBooks />
                    </AdminRoute>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="orders/:id"
                  element={
                    <AdminRoute>
                      <AdminOrderDetail />
                    </AdminRoute>
                  }
                />
                <Route
                  path="transactions"
                  element={
                    <AdminRoute>
                      <AdminTransactions />
                    </AdminRoute>
                  }
                />
                <Route
                  path="transactions/:id"
                  element={
                    <AdminRoute>
                      <AdminTransactionDetail />
                    </AdminRoute>
                  }
                />
                <Route
                  path="authors"
                  element={
                    <AdminRoute>
                      <AdminAuthors />
                    </AdminRoute>
                  }
                />
                <Route
                  path="genres"
                  element={
                    <AdminRoute>
                      <AdminGenres />
                    </AdminRoute>
                  }
                />
              </Routes>
            </AdminLayout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [myStore, setMyStore] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!localStorage.getItem(USER)) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem(USER));
      setUser(storedUser);

      const myStoreRes = await api.get("/stores/mine/");
      if (myStoreRes.data && !myStoreRes.data.detail) {
        setMyStore(myStoreRes.data);
      }

      const cartRes = await api.get("/cart/");
      setCartItemCount(cartRes.data.items.length);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const updateCartItemCount = async () => {
    try {
      const cartRes = await api.get("/cart/");
      setCartItemCount(cartRes.data.items.length);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  return (
    <BrowserRouter>
      <MainAppContent
        user={user}
        myStore={myStore}
        cartItemCount={cartItemCount}
        setUser={setUser}
        setMyStore={setMyStore}
        updateCartItemCount={updateCartItemCount}
      />
    </BrowserRouter>
  );
}

export default App;