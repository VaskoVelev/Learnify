import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        const token = response.data.accessToken;

        localStorage.setItem("accessToken", token);
        setAccessToken(token);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await authApi.logout();

        localStorage.removeItem("accessToken");
        setAccessToken(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const response = await authApi.refresh();
                const token = response.data.accessToken;

                localStorage.setItem("accessToken", token);
                setAccessToken(token);
                setIsAuthenticated(true);
            } catch {
                localStorage.removeItem("accessToken");
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        tryRefresh();
    }, []);

    const value = {
        accessToken,
        isAuthenticated,
        login,
        logout,
    };

    if (loading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
