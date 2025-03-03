import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const checkAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                const refresh = localStorage.getItem(REFRESH_TOKEN);
                if (!refresh) {
                    setIsAuthorized(false);
                    return;
                }
                const res = await api.post("/user/token/refresh/", { refresh });
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(true);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthorized(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" state={{ message: "Please log in to continue." }} />;
}

export default ProtectedRoute;