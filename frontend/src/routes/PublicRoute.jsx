import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
