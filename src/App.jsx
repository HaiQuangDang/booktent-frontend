import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import { ACCESS_TOKEN } from "./constants";

// Authentication
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ProtectedRoute from "./components/ProtectedRoute";

// Stores
import StoresPage from "./pages/stores/StoresPage";
import CreateStore from "./pages/stores/CreateStore";
import StoreDetails from "./pages/stores/StoreDetails";
import EditStorePage from "./pages/stores/EditStorePage";

// Books
import BookManager from "./pages/books/BookManager";

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
  return (
    <>
      {/* <Header /> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <RegisterAndLogout />} />
          <Route path="/logout" element={<Logout />} />

          {/* Stores */}
          <Route path="/stores" element={<StoresPage />} />
          <Route
            path="/stores/create"
            element={
              <ProtectedRoute>
                <CreateStore />
              </ProtectedRoute>
            }
          />
          <Route path="/store/:id" element={<StoreDetails />} />
          <Route
            path="/store/:id/edit"
            element={
              <ProtectedRoute>
                <EditStorePage />
              </ProtectedRoute>
            }
          />

          {/* Books */}
          <Route
            path="/books/manage"
            element={
              <ProtectedRoute>
                <BookManager />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;