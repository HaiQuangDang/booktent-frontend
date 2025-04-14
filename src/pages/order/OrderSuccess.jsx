import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api";
import LoadingIndicator from "../../components/LoadingIndicator";

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
            } catch (error) {
                console.error(error);
                setMessage("Payment verification failed.");
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-semibold text-forest mb-4 font-inter">Order Confirmed</h2>
                <p className="text-soft-gray font-inter">{message}</p>
                {loading && (
                    <div className="mt-4">
                        <LoadingIndicator />
                        checking...
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default OrderSuccess;
