import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import { ACCESS_TOKEN } from "../../constants";
import LoadingIndicator from "../LoadingIndicator";

function AdminRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const alertShown = useRef(false); // Prevent double alert

    useEffect(() => {
        checkAdmin().catch(() => {
            setIsAdmin(false)
            setErrorMessage("You must be an admin to access this page.");
        });
    }, []);

    const checkAdmin = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAdmin(false);
            setErrorMessage("You are not authorized to access this page.");
            return;
        }

        const decoded = jwtDecode(token);
        if (decoded.is_staff) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
            setErrorMessage("You must be an admin to access this page.");
        }
    };

    if (isAdmin === null) {
        return <LoadingIndicator />;
    }

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
}

export default AdminRoute;
