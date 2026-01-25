import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../api/auth.api";
import { getMe } from "../api/user.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const me = await getMe();
        setUser(me);
    };

    const login = async (credentials) => {
        const response = await authApi.login(credentials);
        const token = response.data.accessToken;

        localStorage.setItem("accessToken", token);
        setAccessToken(token);
        setIsAuthenticated(true);

        await loadUser();
    };

    const logout = async () => {
        await authApi.logout();

        localStorage.removeItem("accessToken");
        setAccessToken(null);
        setUser(null);
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

                await loadUser();
            } catch {
                localStorage.removeItem("accessToken");
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        tryRefresh();
    }, []);

    const value = {
        accessToken,
        isAuthenticated,
        user,
        loading,
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
