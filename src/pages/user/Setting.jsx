import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Setting = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        profile: {
            avatar: "",
            address: "",
        },
    });
    const [preview, setPreview] = useState(""); // Avatar preview
    const [selectedFile, setSelectedFile] = useState(null); // Store selected image file
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRes = await api.get("/user/me/");
                setUser(userRes.data);
                setPreview(userRes.data.profile.avatar || "");
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "address") {
            setUser((prev) => ({
                ...prev,
                profile: { ...prev.profile, address: value },
            }));
        } else {
            setUser((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submission prevented"); // Debug
        setErrorMessage("");
        setErrorUsername("");
        setErrorPassword("");
        setErrorEmail("");

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("email", user.email);
        formData.append("profile.address", user.profile.address || "");

        if (selectedFile) {
            formData.append("profile.avatar", selectedFile); // Upload image only if changed
        }

        try {
            await api.put("/user/update/", formData, {
                headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
            });
            alert("Profile updated successfully!");
            navigate("/profile")
        } catch (error) {
            console.log(error)
            console.error("Error details:", error.response?.data); // Log the exact response
            if (error.response?.data) {
                const data = error.response.data;
                if (data.username) setErrorUsername(data.username[0]);
                if (data.email) setErrorEmail(data.email[0]);
                else if (data.detail) {
                    setErrorMessage(data.detail); // This should catch "No active account found..."
                    console.log("Error message set to:", data.detail);
                } else {
                    setErrorMessage("Something went wrong. Please try again.");
                }
            } else {
                setErrorMessage("Network error. Please check your connection.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;

    console.log("User: ", user)

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {/* Avatar Upload & Preview */}
            <div className="flex flex-col items-center mb-4">
                <img
                    src={preview || "/defaultuser.jpg"}
                    alt="Profile Avatar"
                    className="w-24 h-24 rounded-full object-cover mb-2 border"
                    style={{ width: "96px", height: "96px", objectFit: "cover", borderRadius: "50%" }}
                />
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="w-full p-2 border rounded"
                />
                {errorUsername && <p className="text-red-500 text-sm mt-1">{errorUsername}</p>}
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                />
                {errorEmail && <p className="text-red-500 text-sm mt-1">{errorEmail}</p>}
                <textarea
                    name="address"
                    value={user.profile.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Setting;
