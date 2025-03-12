import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api";
import { FaPaypal, FaMoneyBillWave } from "react-icons/fa";
import paypalLogo from "../../assets/paypal.svg"
import cashOnDelivery from "../../assets/cash-on-delivery.svg"


const PreOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems } = location.state || { selectedItems: [] };
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await api.get("/cart/");
                setCart(res.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, []);

    const handleConfirmOrder = async () => {
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        const payload = { cart_item_ids: selectedItems, payment_method: paymentMethod };

        try {
            const res = await api.post("/orders/create/", payload);
            console.log("Order placed:", res.data);
            navigate("/orders/");
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!cart) return <p>Cart not found.</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirm Your Order</h2>
            
            {cart.items.filter(item => selectedItems.includes(item.id)).map((item) => (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg mb-2">
                    <p className="font-semibold text-gray-800">{item.book_title}</p>
                    <p className="text-gray-600">Price: ${item.price}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Total: ${item.total_price}</p>
                </div>
            ))}

            <h3 className="text-xl font-bold mt-6 text-gray-800">Choose Payment Method</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <button onClick={() => setPaymentMethod("paypal")} className={`p-4 border rounded-lg flex items-center space-x-2 ${paymentMethod === "paypal" ? "border-blue-500" : "border-gray-300"}`}>
                    <img src={paypalLogo} alt="PayPal" className="w-22" />
                    <span>PayPal</span>
                </button>
                <button onClick={() => setPaymentMethod("cod")} className={`p-4 border rounded-lg flex items-center space-x-2 ${paymentMethod === "cod" ? "border-green-500" : "border-gray-300"}`}>
                    <img src={cashOnDelivery} alt="Cash on Delivery" className="w-10" />
                    <span>Cash on Delivery</span>
                </button>
            </div>

            <button
                onClick={handleConfirmOrder}
                className="mt-6 px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 w-full"
            >
                Confirm Order
            </button>
        </div>
    );
};

export default PreOrder;
