import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api, { createStripeCheckoutSession } from "../../api";
import stripeLogo from "../../assets/stripelogo.svg";
import cashOnDelivery from "../../assets/cash-on-delivery.svg";
import LoadingIndicator from "../../components/LoadingIndicator";

const PlaceOrder = ({ updateCartItemCount }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems } = location.state || { selectedItems: [] };
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

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
        const fetchUserDetails = async () => {
            try {
                const res = await api.get("/user/me/");
                setAddress(res.data.profile?.address || "");
                setPhone(res.data.profile?.phone_number || "");
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        }
        fetchUserDetails();
        fetchCart();
    }, []);

    const handleConfirmOrder = async () => {
        if (!address.trim() || !phone.trim()) {
            alert("Please fill in both address and phone number.");
            return;
        }

        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        const payload = {
            cart_item_ids: selectedItems,
            payment_method: paymentMethod,
            address: address,
            phone: phone,
        };

        try {
            const res = await api.post("/orders/create/", payload);
            updateCartItemCount();
            const orderIds = res.data.map(order => order.id);

            if (paymentMethod === "online") {
                const checkoutUrl = await createStripeCheckoutSession(orderIds);
                if (checkoutUrl) {
                    window.location.href = checkoutUrl; // Redirect to Stripe
                } else {
                    console.error("Failed to get Stripe checkout URL");
                }
            } else {
                navigate("/orders/list"); // Navigate for COD orders
            }
        } catch (error) {
            alert(error.response.data.error);
            console.error("Error placing order:", error.response.data.error);
        }
    };

    if (loading) return <LoadingIndicator />;
    if (!cart) return <p>Cart not found.</p>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">Confirm Your Order</h1>
            {loading && <p className="text-soft-gray font-inter text-center">Loading...</p>}
            {!cart && <p className="text-soft-gray font-inter text-center">Cart not found.</p>}
            {cart && (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
                    {Object.entries(
                        cart.items
                            .filter(item => selectedItems.includes(item.id))
                            .reduce((acc, item) => {
                                (acc[item.store_id] = acc[item.store_id] || []).push(item);
                                return acc;
                            }, {})
                    ).map(([storeId, items]) => (
                        <div key={storeId} className="mb-6">
                            <h3 className="text-lg font-semibold text-forest mb-2 font-inter">
                                From Store: {items[0].store_name}
                            </h3>
                            {items.map(item => (
                                <div key={item.id} className="p-4 bg-beige rounded-md mb-2">
                                    <p className="font-semibold text-forest font-inter">
                                        <span className="text-soft-gray font-inter">{item.quantity}x </span>{item.book_title}
                                    </p>
                                    <p className="text-soft-gray font-inter">
                                        <span className="text-burnt-orange">${item.price}</span>
                                    </p>
                                    <p className="text-soft-gray font-inter">Total: <span className="text-burnt-orange">${item.total_price}</span></p>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-forest mb-4 font-inter">Shipping Info</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Shipping Address"
                                className="w-full p-3 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest font-inter text-soft-gray"
                            />
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Phone Number"
                                className="w-full p-3 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest font-inter text-soft-gray"
                            />
                        </div>
                    </div>

                    <h3 className="text-xl font-semibold text-forest mb-4 font-inter">Choose Payment Method</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentMethod("online")}
                            className={`p-4 border rounded-md flex items-center gap-2 ${paymentMethod === "online" ? "border-forest bg-beige" : "border-soft-gray"}`}
                        >
                            <img src={stripeLogo} alt="Stripe" className="w-20" />
                            <span className="text-forest font-inter">Stripe</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod("cod")}
                            className={`p-4 border rounded-md flex items-center gap-2 ${paymentMethod === "cod" ? "border-forest bg-beige" : "border-soft-gray"}`}
                        >
                            <img src={cashOnDelivery} alt="Cash on Delivery" className="w-10" />
                            <span className="text-forest font-inter">Cash on Delivery</span>
                        </button>
                    </div>

                    <button
                        onClick={handleConfirmOrder}
                        className="mt-6 px-6 py-3 rounded-md bg-forest text-white hover:bg-burnt-orange transition-colors w-full font-inter"
                    >
                        Confirm Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default PlaceOrder;
