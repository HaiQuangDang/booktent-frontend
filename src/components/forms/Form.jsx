import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from "../../constants";
import LoadingIndicator from "../LoadingIndicator";

function Form({ route, method }) {
  // State declarations
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorUsername, setErrorUsername] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");

  const navigate = useNavigate();
  const formName = method === "login" ? "Login" : "Register";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset errors
    setErrorMessage("");
    setErrorUsername("");
    setErrorPassword("");
    setErrorEmail("");

    // Client-side validation
    if (!username || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }
    if (method === "register" && !email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    setLoading(true);
    try {
      const payload = method === "login" 
        ? { username, password }
        : { username, password, email };

      const res = await api.post(route, payload);

      if (method === "login" && res.data) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        
        const userRes = await api.get("/user/me/");
        localStorage.setItem(USER, JSON.stringify(userRes.data));

        // Check if user is staff and navigate accordingly
        const redirectPath = userRes.data.is_staff ? "/admin" : "/";
        navigate(redirectPath);
        window.location.reload();
      } else {
        navigate("/login");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error details:", error.response?.data);
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle API errors
  const handleError = (error) => {
    if (error.response?.data) {
      const data = error.response.data;
      if (data.username) setErrorUsername(data.username[0]);
      if (data.email) setErrorEmail(data.email[0]);
      if (data.detail) setErrorMessage(data.detail);
      else if (error.response.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } else {
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-6">{formName}</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      {/* Username Field */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errorUsername && <p className="text-red-500 text-sm mt-1">{errorUsername}</p>}
      </div>

      {/* Email Field (Register only) */}
      {method === "register" && (
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
        </div>
      )}

      {/* Password Field */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errorPassword && <p className="text-red-500 text-sm mt-1">{errorPassword}</p>}
      </div>

      {/* Loading Indicator and Submit Button */}
      {loading && <LoadingIndicator />}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
      >
        {formName}
      </button>

      {/* Navigation Links */}
      <p className="mt-4 text-center text-sm text-gray-600">
        {method === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:text-indigo-500">
              Register
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:text-indigo-500">
              Login
            </a>
          </>
        )}
      </p>
    </form>
  );
}

export default Form;