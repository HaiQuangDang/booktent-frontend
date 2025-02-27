import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import StoresPage from "./pages/StoresPage";
import CreateStore from "./pages/CreateStore";
import StoreDetails from "./pages/StoreDetails";
import EditStorePage from "./pages/EditStorePage";

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>

        {/* Admin Dashboard - Only Admins Can Access */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* list of stores - anyone can access */}
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stores/create"
          element={
            <ProtectedRoute>
              <CreateStore />
            </ProtectedRoute>
          }
        />
        <Route path="/store/:id" element={<StoreDetails />} />
        <Route path="/store/:id/edit" 
          element={
            <ProtectedRoute>
              <EditStorePage />
            </ProtectedRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  )
}

export default App