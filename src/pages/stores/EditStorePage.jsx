import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import ProtectedRoute from "../../components/ProtectedRoute";

function EditStorePage() {
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [store, setStore] = useState({ name: "", description: "", contact_info: "", logo: null });
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await api.get(`/stores/mine/`);
        if (!res.data.owner) {
          setErrorMessage("You are not the owner of this store!");
          setTimeout(() => navigate("/"), 2000);
          return;
        }
        setId(res.data.id);
        setStore({
          name: res.data.name || "",
          description: res.data.description || "",
          contact_info: res.data.contact_info || "",
          logo: res.data.logo || null,
        });
        setLogoPreview(res.data.logo || null);
      } catch (error) {
        console.error("Error fetching store details:", error);
        setErrorMessage(error.response?.data?.detail || "An error occurred while fetching store details.");
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [id, navigate]);

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStore({ ...store, logo: file });
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("name", store.name);
      formData.append("description", store.description);
      formData.append("contact_info", store.contact_info);
      if (store.logo instanceof File) {
        formData.append("logo", store.logo);
      }

      await api.patch(`/stores/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate(`/store/setting`);
    } catch (error) {
      console.error("Error updating store:", error);
      setErrorMessage(error.response?.data?.detail || "Failed to update store.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmName !== store.name) {
      setErrorMessage(`Please type "${store.name}" to confirm deletion.`);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await api.delete(`/stores/${id}/`);
      alert("Store deleted successfully!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting store:", error);
      setErrorMessage(error.response?.data?.detail || "Failed to delete store.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmName("");
    }
  };

  if (loading) return <div className="text-center text-soft-gray font-inter">Loading...</div>;
  if (errorMessage && !showDeleteConfirm) return (
    <div className="text-red-500 text-center font-inter p-8">
      {errorMessage}
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8 min-h-screen relative">
        <div className="mb-8">
          <h1 className="text-4xl text-forest text-center font-playfair mb-4">Setting Store</h1>
          <div className="flex justify-end max-w-2xl mx-auto">
            <a
              href={`/store/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-forest px-3 py-1.5 rounded-md bg-gray-50 hover:bg-beige transition-colors font-inter shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7m0 0v7m0-7L10 14m-7 7h7a2 2 0 002-2v-7" />
              </svg>
              View Store
            </a>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-forest font-inter mb-1">Store Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={store.name}
              onChange={handleChange}
              placeholder="Enter store name"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-forest font-inter mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={store.description}
              onChange={handleChange}
              placeholder="Describe your store"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter h-32 resize-y"
            />
          </div>
          <div>
            <label htmlFor="contact_info" className="block text-forest font-inter mb-1">Contact Info</label>
            <input
              id="contact_info"
              type="text"
              name="contact_info"
              value={store.contact_info}
              onChange={handleChange}
              placeholder="e.g., email@example.com or (123) 456-7890"
              required
              className="w-full p-2 border border-soft-gray rounded-md focus:outline-none focus:ring-2 focus:ring-forest text-soft-gray font-inter"
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-forest font-inter mb-1">Store Logo</label>
            <input
              id="logo"
              type="file"
              name="logo"
              onChange={handleLogoChange}
              accept="image/*"
              className="w-full p-2 border border-soft-gray rounded-md text-soft-gray font-inter file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:bg-forest file:text-white file:hover:bg-burnt-orange"
            />
            {(logoPreview || store.logo) && (
              <div className="mt-4 flex items-center gap-4">
                <img
                  src={logoPreview || store.logo}
                  alt="Logo Preview"
                  className="w-24 h-24 object-cover rounded-md shadow-sm"
                />
              </div>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="space-y-2">
              <label htmlFor="delete_confirm" className="block text-red-500 font-inter mb-1">
                Type "{store.name}" to confirm deletion
              </label>
              <input
                id="delete_confirm"
                type="text"
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder={store.name}
                className="w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-soft-gray font-inter"
              />
              {errorMessage && <p className="text-red-500 text-sm font-inter">{errorMessage}</p>}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Store"}
            </button>
            <button
              type="button"
              onClick={() => {setShowDeleteConfirm(!showDeleteConfirm); setDeleteConfirmName("");}}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-inter"
              disabled={loading}
            >
              {showDeleteConfirm ? "Cancel" : "Delete Store"}
            </button>
            {showDeleteConfirm && (
              <button
                type="button"
                onClick={handleDelete}
                className={`flex-1 px-4 py-2 rounded-md transition-colors font-inter ${
                  deleteConfirmName !== store.name || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-700 text-white hover:bg-red-800"
                }`}
                disabled={loading || deleteConfirmName !== store.name}
              >
                {loading ? "Deleting..." : "Confirm Delete"}
              </button>
            )}
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}

export default EditStorePage;