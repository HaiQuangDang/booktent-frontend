import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/user/me/")
            .then((response) => {setUser(response.data); console.log(response)})
            .catch((error) => console.error("Error fetching profile:", error));
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Profile</h2>
            <div className="flex flex-col items-center">
                <img
                    src={user.profile?.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mb-4 border-2 border-gray-300"
                />
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700"><strong>Username:</strong> {user.username}</p>
                    <p className="text-lg font-semibold text-gray-700"><strong>Email:</strong> {user.email}</p>
                    <p className="text-lg font-semibold text-gray-700"><strong>Address:</strong> {user.profile?.address || "N/A"}</p>
                </div>
                <button
                    className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                    onClick={() => navigate("/setting")}
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
