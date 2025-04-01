import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Cart = ({ updateCartItemCount }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchCart();
    }, []);

    const toggleItemSelection = (itemId) => {
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    const toggleSelectAll = () => {
        if (!cart || !cart.items) return;
        setSelectedItems(selectedItems.length === cart.items.length ? [] : cart.items.map((item) => item.id));
    };

    const handleRemove = async (itemId) => {
        try {
            await api.delete(`/cart/remove/${itemId}/`);
            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            }));
            setSelectedItems((prev) => prev.filter((id) => id !== itemId));
            updateCartItemCount();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                handleRemove(itemId);
                return;
            }
            const res = await api.put(`/cart/update/${itemId}/`, { quantity: newQuantity });
            setCart(res.data);
            updateCartItemCount();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handlePlaceOrder = async () => {
        if (selectedItems.length === 0) return;
        navigate("/place-order", { state: { selectedItems } });
    };

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center">
                Shopping Cart
            </h1>
            {loading && <p className="text-soft-gray font-inter text-center">Loading cart...</p>}
            {!cart || !cart.items || cart.items.length === 0 ? (
                <p className="text-soft-gray font-inter text-center">Your cart is empty.</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto">
                    <label className="flex items-center gap-2 mb-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedItems.length === cart.items.length && cart.items.length > 0}
                            onChange={toggleSelectAll}
                            className="h-5 w-5 text-forest rounded focus:ring-forest"
                        />
                        <span className="text-soft-gray font-inter">Select All</span>
                    </label>
                    {cart.items.map((item) => (
                        <div key={item.id} className="flex items-center p-4 mb-4 bg-beige rounded-md">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className="h-5 w-5 text-forest rounded focus:ring-forest"
                            />
                            <div className="flex-1 ml-4">
                                <p className="font-semibold text-forest font-inter">{item.book_title}</p>
                                <p className="text-soft-gray font-inter"><span className="text-burnt-orange">${item.price}</span></p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        className="bg-soft-gray text-white px-3 py-1 rounded-full hover:bg-forest transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-forest font-inter">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        className="bg-soft-gray text-white px-3 py-1 rounded-full hover:bg-forest transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-soft-gray font-inter mt-2">Total: <span className="text-burnt-orange">${item.total_price}</span></p>
                            </div>
                            <button
                                onClick={() => handleRemove(item.id)}
                                className="text-red-500 hover:text-red-700 font-inter ml-4"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <h3 className="text-xl font-semibold text-forest mt-6 font-inter">Total Price: <span className="text-burnt-orange">${cart.total_price}</span></h3>
                    <button
                        onClick={handlePlaceOrder}
                        disabled={selectedItems.length === 0}
                        className={`mt-6 px-6 py-3 rounded-md text-white font-inter ${selectedItems.length > 0 ? "bg-forest hover:bg-burnt-orange" : "bg-soft-gray cursor-not-allowed"} transition-colors`}
                    >
                        Place Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default Cart;