import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

function StoreForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [errorStoreName, setErrorStoreName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorStoreName(""); // Clear previous errors
    try {
      const res = await api.post("/stores/", {
        name,
        description,
        contact_info: contactInfo,
      });
      const storeId = res.data.id;
      alert("Store created successfully!");
      navigate(`/dashboard`);
      window.location.reload();
    } catch (error) {
      if (error.response?.data?.name) {
        setErrorStoreName(error.response.data.name[0]);
      } else {
        setErrorStoreName("Failed to create store. Please try again.");
      }
      console.error("Error creating store:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h2 className="text-4xl text-forest mb-8 text-center font-playfair">Create a Store</h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-forest font-inter mb-1">Store Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter store name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
          />
          {errorStoreName && <p className="text-red-500 text-sm mt-1 font-inter">{errorStoreName}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-forest font-inter mb-1">Description</label>
          <textarea
            id="description"
            placeholder="Describe your store"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter h-32 resize-y"
          />
        </div>
        <div>
          <label htmlFor="contact_info" className="block text-forest font-inter mb-1">Contact Information</label>
          <input
            id="contact_info"
            type="text"
            placeholder="e.g., email@example.com or (123) 456-7890"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
          />
        </div>
        <button
          type="submit"
          className="w-full btn-primary"
        >
          Create Store
        </button>
      </form>
    </div>
  );
}

export default StoreForm;