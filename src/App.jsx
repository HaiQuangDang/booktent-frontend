import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"
import { ACCESS_TOKEN } from "./constants"

//authentication
import Login from "./pages/authentication/Login"
import Register from "./pages/authentication/Register"
import ProtectedRoute from "./components/ProtectedRoute"

//stores
import StoresPage from "./pages/stores/StoresPage";
import CreateStore from "./pages/stores/CreateStore";
import StoreDetails from "./pages/stores/StoreDetails";
import EditStorePage from "./pages/stores/EditStorePage";

function Logout() {
  localStorage.clear()
  return <Navigate to="/" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

const isAuthenticated = () => !!localStorage.getItem(ACCESS_TOKEN)

function App() {
  return (
    <>
    {/* <Header /> */}
    <BrowserRouter>
      <Routes>

        {/* Home - Anyone can access */}
        <Route path="/" element={<Home />} />

        {/* Redirect logged-in users from Login & Register */}
        <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={isAuthenticated() ? <Navigate to="/" /> : <RegisterAndLogout />} />

        <Route path="/logout" element={<Logout />} />

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

        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App