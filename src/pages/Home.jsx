import React from "react";
import { Link } from "react-router-dom";
import { USER } from "../constants";
import { useEffect, useState } from "react";
import api from "../api";


function Home() {
    const [user, setUser] = useState(null)
    const [mystore, setMystore] = useState(null)

    useEffect(() => {
        const fetchMyStore = async () => {

            if (localStorage.getItem(USER)) {
                setUser(JSON.parse(localStorage.getItem(USER)))
                try {
                    const myStoreRes = await api.get("/stores/mine/");
                    console.log(myStoreRes)
                    if (myStoreRes.data && !myStoreRes.data.detail) {
                        setMystore(myStoreRes.data)
                    } else if (myStoreRes.data.detail) {
                        console.log(myStoreRes.data.detail)
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }

        };
        fetchMyStore();

    }, []);


    return (
        <div>

            <h1>Welcome! {user ? user.username : "Guess"}</h1>
            {user === null ?
                (
                    <Link to="/login">
                        Login
                    </Link>
                ) : (
                    <Link to="/logout">
                        Logout
                    </Link>
                )
            }

            {mystore ?
                (
                    <Link to={`/store/${mystore.id}`}>
                        My Store
                    </Link>
                ) : (
                    <Link to="/stores/create">
                        Create Store
                    </Link>
                )
            }

        </div>

    )
}

export default Home;