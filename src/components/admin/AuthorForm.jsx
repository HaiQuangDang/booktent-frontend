import { useState, useEffect } from "react";
import api from "../../api";

function AuthorForm({ author, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    date_of_birth: "",
    date_of_death: "",
    photo: null,
  });

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || "",
        bio: author.bio || "",
        date_of_birth: author.date_of_birth || "",
        date_of_death: author.date_of_death || "",
        photo: null,
      });
    }
  }, [author]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      if (author) {
        await api.put(`/books/authors/${author.id}/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Update author successfully");
      } else {
        await api.post("/books/authors/", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Add author successfully");
      }
    } catch (error) {
      console.error("Error saving author:", error);
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md font-inter">
        <h2 className="text-2xl font-semibold text-forest mb-6 text-center">
          {author ? "Edit Author" : "Add Author"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-forest mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-soft-gray rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-burnt-orange/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest mb-1">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest mb-1">Date of Death</label>
              <input
                type="date"
                name="date_of_death"
                value={formData.date_of_death || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-soft-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-burnt-orange/60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-soft-gray rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-burnt-orange hover:bg-burnt-orange/80 text-white px-4 py-2 rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthorForm;
