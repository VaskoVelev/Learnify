import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    GradientBackground,
    FloatingOrbs,
    Navbar
} from "../../components";

const TeacherHomePage = () => {
    const { logout } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await logout();
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={true}
                showProfile={true}
            />
        </GradientBackground>
    );
};

export default TeacherHomePage;
