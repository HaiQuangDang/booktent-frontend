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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <RegisterAndLogout />} />
          <Route path="/logout" element={<Logout />} />

          {/* Stores */}
          <Route path="/store/create" element={<CreateStore />}/>
          <Route path="/store/:id" element={<StoreDetails />} />
          <Route path="/store/:id/edit" element={<EditStorePage />}
          />

          {/* Books */}
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/:id/edit" element={<EditBookPage />} />
          <Route path="/books/add" element={<AddBookPage />} />

          {/* Authors */}
          <Route path="/author/:id" element={<AuthorDetail />} />

          {/* Genres */}
          <Route path="/genre/:id" element={<GenreDetail />} />

          {/* User */}
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;