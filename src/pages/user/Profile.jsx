import { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/user/me/")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  if (!user) return <LoadingIndicator />;

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <h1 className="text-4xl text-forest mb-8 text-center">Your Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6 flex gap-8 max-w-3xl mx-auto">
        <div className="w-1/3 flex flex-col items-center">
          <img
            src={user.profile?.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-40 h-40 rounded-full mb-6 border-2 border-forest object-cover transition-transform hover:scale-105"
          />
          <button
            className="px-6 py-2 bg-forest text-white rounded-md hover:bg-burnt-orange transition-colors font-inter"
            onClick={() => navigate("/setting")}
          >
            Edit Profile
          </button>
        </div>
        <div className="w-2/3 space-y-6 text-soft-gray font-inter">
          <div className="space-y-2">
            <p><strong className="text-forest">Username:</strong> {user.username}</p>
            <p><strong className="text-forest">Email:</strong> {user.email}</p>
            <p><strong className="text-forest">Address:</strong> {user.profile?.address || "Not set"}</p>
            <p><strong className="text-forest">Phone:</strong> {user.profile?.phone_number || "Not set"}</p> {/* ✅ New Line */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
