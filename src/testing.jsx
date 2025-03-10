import { useEffect, useState } from "react";
import api from "../../api";

const Setting = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    profile: {
      avatar: "",
      address: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await api.get("/user/me/");
        setUser(userRes.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.put("/user/update/", {
        username: user.username,
        email: user.email,
        profile: { address: user.profile.address },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Account Settings</h2>

      {/* Avatar */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={user.profile.avatar || "/default-avatar.jpg"}
          alt="Profile Avatar"
          className="w-16 h-16 rounded-full border"
        />
        <div>
          <p className="text-lg font-semibold">{user.username}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
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
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="address"
          value={user.profile.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Setting;
