import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
function StoreForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const navigate = useNavigate();


    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token) {
        alert("You must be logged in to create a store!");
        navigate("/login");
        return;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/stores/", {
                name,
                description,
                contact_info: contactInfo,
            });
            console.log("Store Created:", res.data);
            navigate("/stores"); // Redirect to stores list
        } catch (error) {
            console.error("Error creating store:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create a Store</h2>
            <input
                type="text"
                placeholder="Store Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            ></textarea>
            <input
                type="text"
                placeholder="Contact Information"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
            />
            <button type="submit">Create Store</button>
        </form>
    );
}

export default StoreForm;
