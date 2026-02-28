import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const authContext = createContext();

export default function AuthContextProvider({ children }) {
    const[userdata,setuserdata] = useState(null)
    const [islogin, setlogin] = useState(function(){
        return localStorage.getItem('token')
    });

    async function getUserData(){
        const {data} = await axios.get('https://route-posts.routemisr.com/users/profile-data', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
        setuserdata(data?.data?.user)
    }

    useEffect(() => {
        // Whenever the login token changes, reload user data.
        if (islogin) {
            getUserData()
        } else {
            setuserdata(null)
        }
    }, [islogin])

    return (
    <authContext.Provider value={{ islogin, setlogin, userdata }}>
        {children}
    </authContext.Provider>
    );
}