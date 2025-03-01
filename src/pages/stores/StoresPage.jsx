import { useState, useEffect } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

function StoresPage() {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const res = await api.get("/stores/");
            console.log(res)
            setStores(res.data);
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
    };

    return (
        <div>
            <h1>Stores</h1>
            {stores.length === 0 ? (
                <p>No stores available.</p>
            ) : (
                <ul>
                    {stores.map((store) => (
                        <li key={store.id}>
                            <h2><Link to={`/store/${store.id}`}>{store.name}</Link></h2>
                            <p>{store.description}</p>
                            {store.logo && <img src={store.logo} alt={store.name} width="100" />}
                        </li>
                    ))}
                </ul>
            )}

            <Link to="/stores/create">
                <button>Create Store</button>
            </Link>
        </div>
    );
}

export default StoresPage;
