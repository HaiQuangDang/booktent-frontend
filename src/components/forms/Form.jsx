import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from "../../constants";
import LoadingIndicator from "../LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        // Basic client-side validation
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
            // Prepare payload based on method
            const payload = method === "login"
                ? { username, password }
                : { username, password, email };

            const res = await api.post(route, payload);
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                const userRes = await api.get("/user/me/");
                localStorage.setItem(USER, JSON.stringify(userRes.data));
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            console.error("An error occurred:", error);
            if (error.response?.data) {
                if (error.response.data.username) {
                    // errors.push(error.response.data.username[0]);
                    setErrorUsername(error.response.data.username[0]);
                }
                if (error.response.data.email) {
                    // errors.push(error.response.data.email[0]);
                    setErrorEmail(error.response.data.email[0]);
                }
                if (error.response.data.detail) {
                    // errors.push(error.response.data.detail);
                    setErrorMessage(error.response.data.detail);
                }
            } else {
                setErrorMessage(
                    error.response?.status === 401
                        ? "Invalid username or password."
                        : "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">{name}</h1>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
                id="username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            {errorUsername && <p className="text-red-500 text-sm mt-1">{errorUsername}</p>}

            {method === "register" && (
                <>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mt-4">Email</label>
                    <input
                        id="email"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
                </>
            )}

            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">Password</label>
            <input
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />

            {loading && <LoadingIndicator />}
            <button className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit" disabled={loading}>
                {name}
            </button>

            {method === "login" && (
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <a href="/register" className="text-indigo-600 hover:text-indigo-500">Register</a>
                </p>
            )}

            {method === "register" && (
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">Login</a>
                </p>
            )}
        </form>
    );
}

export default Form;