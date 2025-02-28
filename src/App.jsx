import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"

//authentication
import Login from "./pages/authentication/Login"
import Register from "./pages/authentication/Register"
import ProtectedRoute from "./components/ProtectedRoute"
//admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoute from "./components/admin/AdminRoute";
//stores
import StoresPage from "./pages/stores/StoresPage";
import CreateStore from "./pages/stores/CreateStore";
import StoreDetails from "./pages/stores/StoreDetails";
import EditStorePage from "./pages/stores/EditStorePage";

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