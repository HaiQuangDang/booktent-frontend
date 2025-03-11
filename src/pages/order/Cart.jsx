import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Cart = ({ updateCartItemCount }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate()

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

    // Toggle item selection
    const toggleItemSelection = (itemId) => {
        setSelectedItems((prev) => {
            const newSelection = prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId];

            return newSelection;
        });
    };

    // Select all items
    const toggleSelectAll = () => {
        if (selectedItems.length === cart.items.length) {
            setSelectedItems([]); // Uncheck all
        } else {
            setSelectedItems(cart.items.map((item) => item.id)); // Check all
        }
    };

    // Remove item from cart
    const handleRemove = async (itemId) => {
        try {
            await api.delete(`/cart/remove/${itemId}/`);
            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            }));
            setSelectedItems((prev) => prev.filter((id) => id !== itemId)); // Remove from selection
            updateCartItemCount();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Update quantity
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

    // Place order
    const handlePlaceOrder = async () => {
        try {
            const payload = { cart_item_ids: selectedItems };
            const res = await api.post("/orders/create/", payload);
            console.log("Order placed:", res.data);
            setSelectedItems([]);
            updateCartItemCount();
            navigate("/orders/")

        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

    const allSelected = selectedItems.length === cart.items.length && cart.items.length > 0;
    const canPlaceOrder = selectedItems.length > 0;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Shopping Cart</h2>
            <label className="flex items-center space-x-2 mb-4 cursor-pointer">
                <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">Select All</span>
            </label>
            {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 mb-4 bg-gray-50 rounded-lg shadow-sm">
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <div className="flex-1 ml-4">
                        <p className="font-semibold text-gray-800">{item.book_title}</p>
                        <p className="text-gray-600">Price: ${item.price}</p>
                        <div className="flex items-center space-x-2 mt-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="bg-gray-200 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-300"
                            >
                                -
                            </button>
                            <span className="text-gray-800">{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="bg-gray-200 px-3 py-1 rounded-full text-gray-700 hover:bg-gray-300"
                            >
                                +
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2">Total: ${item.total_price}</p>
                    </div>
                    <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:underline ml-4"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <h3 className="text-xl font-bold mt-6 text-gray-800">Total Price: ${cart.total_price}</h3>
            <button
                onClick={handlePlaceOrder}
                disabled={!canPlaceOrder}
                className={`mt-6 px-6 py-3 rounded-lg text-white ${canPlaceOrder ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
                    }`}
            >
                Place Order
            </button>
        </div>
    );
};

export default Cart;
