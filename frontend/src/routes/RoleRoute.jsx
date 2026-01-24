import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return null;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default RoleRoute;
