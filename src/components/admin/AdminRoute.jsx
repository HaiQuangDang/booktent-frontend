import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, useRef } from "react";
import { ACCESS_TOKEN } from "../../constants";

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
            console.log("is_staff: " + decoded.is_staff)
        } else {
            setIsAdmin(false);
            setErrorMessage("You must be an admin to access this page.");
            console.log("is_staff: " + decoded.is_staff)
        }
    };

    if (isAdmin === null) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        // if (!alertShown.current) {
        //     alert(errorMessage); // Show alert only once
        //     alertShown.current = true;
        // }
        return <Navigate to="/" />;
    }

    return children;
}

export default AdminRoute;
