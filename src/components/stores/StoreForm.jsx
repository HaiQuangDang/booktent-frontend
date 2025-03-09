import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
function StoreForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [errorStoreName, setErrorStoreName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/stores/", {
                name,
                description,
                contact_info: contactInfo,
            });
            const storeId = res.data.id;
            alert("Store created successfully!");
            navigate(`/store/${storeId}`); // Redirect to store details
        } catch (error) {
            if (error.response.data.name) {
                setErrorStoreName(error.response.data.name[0]);
            }
            console.error("Error creating store:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Create a Store</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Store Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errorStoreName && <p className="text-red-500 text-sm mt-2">{errorStoreName}</p>}
            </div>
            <div className="mb-4">
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Contact Information"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
                Create Store
            </button>
        </form>
    );
}

export default StoreForm;
