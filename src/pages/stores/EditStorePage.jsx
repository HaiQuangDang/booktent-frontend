import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../styles/Form.css"
function EditStorePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [store, setStore] = useState({ name: "", description: "", contact_info: "", logo: null });
    const [logoPreview, setLogoPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const fetchStore = async () => {
            console.log(id)
            try {
                const res = await api.get(`/store/${id}/`);
                const userRes = await api.get("/user/me/");

                // Only allow the owner to edit
                if (res.data.owner !== userRes.data.username) {
                    setErrorMessage("You are not the owner of this store!");
                    setTimeout(() => navigate("/stores"), 2000); // Redirect after 2 seconds
                    return;
                }
                setStore({
                    name: res.data.name,
                    description: res.data.description,
                    contact_info: res.data.contact_info,
                    logo: res.data.logo,
                });
            } catch (error) {
                console.error("Error fetching store details:", error);
                setErrorMessage("Something went wrong. Redirecting...");
                setTimeout(() => navigate("/"), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchStore();
    }, [id, navigate]);

    const handleChange = (e) => {
        setStore({ ...store, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setStore({ ...store, logo: file });
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("name", store.name);
            formData.append("description", store.description);
            formData.append("contact_info", store.contact_info);
            if (store.logo instanceof File) {
                formData.append("logo", store.logo);
            }

            await api.patch(`/store/${id}/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate(`/store/${id}/`);
        } catch (error) {
            console.error("Error updating store:", error);
        }
    };



    if (loading) return <div>Loading...</div>;
    if (errorMessage) return <div style={{ color: "red" }}>{errorMessage}</div>;
    return (
        <div>
            <h1>Edit Store</h1>
            <form className="form-container" onSubmit={handleSubmit}>
                <label>Name:</label>
                <input className="form-input" type="text" name="name" value={store.name} onChange={handleChange} required />

                <label>Description:</label>
                <textarea className="form-input" name="description" value={store.description} onChange={handleChange} required />

                <label>Contact Info:</label>
                <input className="form-input" type="text" name="contact_info" value={store.contact_info} onChange={handleChange} required />

                <label>Logo:</label>
                <input className="form-input" type="file" accept="image/*" onChange={handleLogoChange} />
                {logoPreview && <img src={logoPreview} alt="Logo Preview" style={{ width: "100px", height: "100px" }} />}
                {store.logo && !logoPreview && <img src={store.logo} alt="Current Logo" style={{ width: "100px", height: "100px" }} />}

                <button className="form-button" type="submit" disabled={loading}>{loading ? "Updating..." : "Update Store"}</button>
            </form>
        </div>
    );
}

export default EditStorePage;
