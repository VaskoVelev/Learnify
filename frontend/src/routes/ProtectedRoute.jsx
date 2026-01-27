import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;