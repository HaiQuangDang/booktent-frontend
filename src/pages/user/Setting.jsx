import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

const Setting = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        profile: {
            avatar: "",
            address: "",
            phone_number: "",
        },
    });
    const [userId, setUserId] = useState(null);
    const [preview, setPreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    const [deleteConfirmName, setDeleteConfirmName] = useState(""); // For delete confirmation
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Toggle delete confirmation

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRes = await api.get("/user/me/");
                setUser(userRes.data);
                setUserId(userRes.data.id);
                setPreview(userRes.data.profile.avatar || "");
            } catch (error) {
                console.error("Error fetching user:", error);
                setErrors({ general: "Failed to load profile." });
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["address", "phone_number"].includes(name)) {
            setUser((prev) => ({
                ...prev,
                profile: { ...prev.profile, [name]: value },
            }));
        } else {
            setUser((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setUpdating(true);

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("email", user.email);
        formData.append("profile.address", user.profile.address || "");
        formData.append("profile.phone_number", user.profile.phone_number || "");
        if (selectedFile) {
            formData.append("profile.avatar", selectedFile);
        }

        try {
            await api.put("/user/update/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Profile updated successfully!");
            navigate("/profile");
        } catch (error) {
            console.log("Update error:", error.response?.data);
            const data = error.response?.data || {};
            setErrors({
                username: data.username?.[0],
                email: data.email?.[0],
                general: data.detail || "Something went wrong. Please try again.",
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (deleteConfirmName !== user.username) {
            setErrors({ general: `Please type "${user.username}" to confirm deletion.` });
            return;
        }

        setUpdating(true);
        setErrors({});

        try {
            await api.delete(`/user/delete/${userId}/`); // Adjust endpoint if needed
            alert("Account deleted successfully!");
            navigate("/logout");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting account:", error);
            setErrors({ general: error.response?.data?.detail || "Failed to delete account." });
        } finally {
            setUpdating(false);
            setShowDeleteConfirm(false);
            setDeleteConfirmName("");
        }
    };

    if (loading) return <LoadingIndicator />;
    if (updating) return <div className="text-center text-forest font-inter">Processing...</div>;

    return (
        <div className="container mx-auto p-8 min-h-screen">
            <h1 className="text-4xl text-forest mb-8 text-center font-playfair">Profile Settings</h1>
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                {errors.general && !showDeleteConfirm && (
                    <p className="text-red-500 mb-4 text-center font-inter">{errors.general}</p>
                )}

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={preview || "/defaultuser.jpg"}
                        alt="Profile Avatar"
                        className="w-24 h-24 rounded-full mb-4 border-2 border-forest object-cover transition-transform hover:scale-105"
                    />
                    <label className="bg-forest text-white px-4 py-2 rounded-md hover:bg-burnt-orange transition-colors font-inter cursor-pointer">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full p-3 border border-soft-gray rounded-md font-inter text-soft-gray focus:outline-none focus:ring-2 focus:ring-forest"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1 font-inter">{errors.username}</p>}
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full p-3 border border-soft-gray rounded-md font-inter text-soft-gray focus:outline-none focus:ring-2 focus:ring-forest"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1 font-inter">{errors.email}</p>}
                    </div>
                    <div>
                        <textarea
                            name="address"
                            value={user.profile?.address ?? ""}
                            onChange={handleChange}
                            placeholder="Address"
                            className="w-full p-3 border border-soft-gray rounded-md font-inter text-soft-gray focus:outline-none focus:ring-2 focus:ring-forest"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="phone_number"
                            value={user.profile?.phone_number ?? ""}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="w-full p-3 border border-soft-gray rounded-md font-inter text-soft-gray focus:outline-none focus:ring-2 focus:ring-forest"
                        />
                    </div>

                    {showDeleteConfirm && (
                        <div className="space-y-2">
                            <label htmlFor="delete_confirm" className="block text-red-500 font-inter mb-1">
                                Type "{user.username}" to confirm deletion
                            </label>
                            <input
                                id="delete_confirm"
                                type="text"
                                value={deleteConfirmName}
                                onChange={(e) => setDeleteConfirmName(e.target.value)}
                                placeholder={user.username}
                                className="w-full p-3 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-soft-gray font-inter"
                            />
                            {errors.general && <p className="text-red-500 text-sm font-inter">{errors.general}</p>}
                        </div>
                    )}

                    <div className="flex gap-4 justify-center">
                        <button
                            type="button"
                            onClick={() => { setShowDeleteConfirm(!showDeleteConfirm); setDeleteConfirmName(""); }}
                            className="flex-1 p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-inter"
                            disabled={updating}
                        >
                            {showDeleteConfirm ? "Cancel" : "Delete Account"}
                        </button>
                        {showDeleteConfirm && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={`flex-1 p-3 rounded-md transition-colors font-inter ${deleteConfirmName !== user.username || updating
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-red-700 text-white hover:bg-red-800"
                                    }`}
                                disabled={updating || deleteConfirmName !== user.username}
                            >
                                {updating ? "Deleting..." : "Confirm Delete"}
                            </button>
                        )}
                        <button
                            type="submit"
                            className="flex-1 p-3 bg-forest text-white rounded-md hover:bg-burnt-orange transition-colors font-inter"
                            disabled={updating}
                        >
                            Update Profile
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default Setting;