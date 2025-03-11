import { useEffect, useState } from "react";
import api from "../../api";

const Cart = ({ updateCartItemCount }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

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
        setSelectedItems((prev) =>
            prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
        );
    };

    // Toggle select all
    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cart.items.map((item) => item.id));
        }
        setSelectAll(!selectAll);
    };

    // Remove items
    const handleRemove = async (itemId) => {
        try {
            await api.delete(`/cart/remove/${itemId}/`);
            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.id !== itemId),
            }));
            updateCartItemCount();  // 🔥 Update Cart Badge
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // Update quantity
    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            if (newQuantity <= 0) {
                handleRemove(itemId); // Remove item if quantity is zero
                return;
            }
            const res = await api.put(`/cart/update/${itemId}/`, { quantity: newQuantity });
            setCart(res.data);
            updateCartItemCount(); // update Cart Badge
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // Clear cart
    const handleClearCart = async () => {
        try {
            await api.delete("/cart/clear/");
            setCart({ items: [] });
            updateCartItemCount();  // 🔥 Update Cart Badge
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    // Place order
    const handlePlaceOrder = async () => {
        try {
            const payload = selectedItems.length > 0 ? { cart_item_ids: selectedItems } : {};
            const res = await api.post("/orders/create/", payload);
            console.log("Order placed:", res.data);
            updateCartItemCount();
            fetchCart(); // Clear cart after successful order
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    if (loading) return <p>Loading cart...</p>;
    if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
            <label className="flex items-center space-x-2 mb-2">
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                />
                <span>Select All</span>
            </label>
            {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b">
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                    />
                    <div>
                        <p className="font-semibold">{item.book_title}</p>
                        <p>Price: ${item.price}</p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="bg-gray-300 px-2 rounded"
                            >
                                -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="bg-gray-300 px-2 rounded"
                            >
                                +
                            </button>
                        </div>
                        <p>Total: ${item.total_price}</p>
                    </div>
                    <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:underline"
                    >
                        Remove
                    </button>
                </div>
            ))}
            <h3 className="text-lg font-bold mt-4">Total Price: ${cart.total_price}</h3>
            <button
                onClick={handlePlaceOrder}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                disabled={selectedItems.length === 0}
            >
                Place Order
            </button>
            <button
                onClick={handleClearCart}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
                Clear Cart
            </button>
        </div>
    );
};

export default Cart;
