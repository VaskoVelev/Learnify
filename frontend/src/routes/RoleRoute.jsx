import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default RoleRoute;
