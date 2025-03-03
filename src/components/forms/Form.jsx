import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from "../../constants";
import "../../styles/Form.css";
import LoadingIndicator from "../LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(""); // New email state
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
            console.log(error.response)
            setErrorMessage(
                error.response?.data?.detail ||
                error.response?.data?.username?.[0] ||
                error.response?.data?.email?.[0] || // Handle email-specific errors
                (error.response?.status === 401
                    ? "Invalid username or password."
                    : "Something went wrong. Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <label htmlFor="username" className="visually-hidden">Username</label>
            <input
                id="username"
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />

            <label htmlFor="password" className="visually-hidden">Password</label>
            <input
                id="password"
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />

            {method === "register" && (
                <>
                    <label htmlFor="email" className="visually-hidden">Email</label>
                    <input
                        id="email"
                        className="form-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </>
            )}

            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit" disabled={loading}>
                {name}
            </button>
        </form>
    );
}

export default Form;

// Optional CSS for accessibility (already suggested earlier)
// .visually-hidden {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   border: 0;
// }