import StoreForm from "../../components/stores/StoreForm";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useState, useEffect } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../../components/LoadingIndicator";


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

  if (loading) return <LoadingIndicator />;

  return (
    <ProtectedRoute>
      <StoreForm />
    </ProtectedRoute>
  );
}

export default CreateStore;
