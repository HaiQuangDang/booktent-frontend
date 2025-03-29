import { useState } from "react";

function GenreForm({ genre, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: genre?.name || "",
        description: genre?.description || "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
            <h3 className="text-xl font-semibold mb-2">{genre.id ? "Edit Genre" : "Add Genre"}</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block font-semibold">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="block font-semibold">Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                        Save
                    </button>
                    <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default GenreForm;
