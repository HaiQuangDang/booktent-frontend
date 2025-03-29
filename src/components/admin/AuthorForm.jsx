import { useState, useEffect } from "react";
import api from "../../api";

function AuthorForm({ author, onClose, onSave }) {
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
                alert("Update author successfully")
            } else {
                await api.post("/books/authors/", formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                alert("Add author successfully")
            }
            // onSave();
        } catch (error) {
            console.error("Error saving author:", error);
        } finally {
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">{author ? "Edit Author" : "Add Author"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Author Name"
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="date"
                        name="date_of_death"
                        value={formData.date_of_death || ""}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                    <div className="flex justify-between">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthorForm;
