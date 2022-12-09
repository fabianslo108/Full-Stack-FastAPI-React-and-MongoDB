import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({})

    useEffect(() => {
        console.log("reloaded user data")
        const userData = localStorage.getItem("carUserData");
        if (userData) setAuth(JSON.parse(userData));
    }, []);

    return <AuthContext.Provider value={{ auth, setAuth }}>
        {children}
    </AuthContext.Provider>
};
export default AuthContext;