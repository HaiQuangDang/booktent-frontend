import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("Verifying payment...");

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get("session_id");
            if (!sessionId) {
                setMessage("Invalid payment session.");
                setLoading(false);
                return;
            }

            try {
                // Verify session with backend
                const res = await api.post("/orders/payment-success/", { session_id: sessionId });
                setMessage("Payment successful! Redirecting to your orders...");
                setTimeout(() => navigate("/orders/list"), 3000);
                console.log(res.response)
            } catch (error) {
                console.error("Payment verification failed:", error);
                setMessage("Payment verification failed.");
            } finally {
                
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Status</h2>
            <p className="text-gray-600">{message}</p>
            {loading && <p className="text-blue-500">Checking...</p>}
        </div>
    );
};

export default OrderSuccess;
