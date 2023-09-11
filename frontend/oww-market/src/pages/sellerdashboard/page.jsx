import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/loading";
import request from "./helper";
import Navbar from "./components/Navbar";

const Page =  () => {
    
    const [user, setUser] = useState("");

    var token = localStorage.getItem("token");
    if(!token) return window.location.href = "/";

useEffect(() => {
    const fetchData = async () => {
        try {
            const result = await request();
                if(!result) return window.location.href = "/";
            setUser(JSON.parse(localStorage.getItem('user')))
            } catch (error) {
              console.error(error);
            }
          };
          fetchData();
    }, [])
    

    return (
        <>
            <Navbar/>
            <h1>Welcome, {user.name}</h1>
        </>
    )

}
export default Page;