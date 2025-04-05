import StoreForm from "../../components/stores/StoreForm";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";


function CreateStore() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const storeRes = await api.get(`/stores/mine/`);
      if (storeRes.data.owner) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Store not found");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <h1>Create Your Store</h1>
      <StoreForm />
    </ProtectedRoute>
  );
}

export default CreateStore;
