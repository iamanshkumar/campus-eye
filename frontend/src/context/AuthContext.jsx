import { createContext, useContext, useState, useEffect } from "react";
import api from '../utils/api';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const storedUser = localStorage.getItem("currentUser");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                console.log("Auth registeration error : ", err);
                localStorage.removeItem("currentUser");
            } finally {
                setLoading(false);
            }
        }

        checkUser();
    }, [])

    const updateUser = (data)=>{
        setUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data));
    }

    const login = async (email, password) => {
        const { data } = await api.post(`/api/auth/login`, { email, password });
        const userData = data.user;
        updateUser(userData);
        return data;
    }

    const register = async (fullName, username, email, password, cgpa, branch, year) => {
        const { data } = await api.post(`/api/auth/register`, { fullName, username, email, password, cgpa, branch, year });
        const userData = data.user;
        setUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
        return data;
    }

    

    const logout = async () => {
        try {
            await api.post(`/api/auth/logout`, {});
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            localStorage.removeItem("currentUser");
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

