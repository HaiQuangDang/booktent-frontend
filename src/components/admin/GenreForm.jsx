import { useState, useEffect } from "react";

function GenreForm({ genre, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (genre) {
      setFormData({
        name: genre.name || "",
        description: genre.description || "",
      });
    }
  }, [genre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md font-inter">
        <h2 className="text-2xl font-semibold text-forest mb-6 text-center">
          {genre?.id ? "Edit Genre" : "Add Genre"}
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
            <label className="block text-sm font-medium text-forest mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-soft-gray rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-burnt-orange/60"
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

export default GenreForm;
