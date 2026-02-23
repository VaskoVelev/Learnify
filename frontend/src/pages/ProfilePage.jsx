import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    ProfileHeader,
    ProfileDetails
} from "../components";

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
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

    const handleEdit = () => {
        navigate("/profile/edit");
    };

    return (
        <GradientBackground>
            <FloatingOrbs />

            {/* Navigation bar */}
            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={false}
                showProfile={false}
            />

            {/* Main content area */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">

                {/* Error display */}
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {/* Page title */}
                <PageHeader
                    title="My Profile"
                    subtitle="Manage your account information"
                />

                {/* Profile card */}
                <div
                    className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                    }}
                >
                    {/* Profile header with avatar and edit button */}
                    <ProfileHeader
                        user={user}
                        onEdit={handleEdit}
                    />

                    {/* Profile details grid */}
                    <ProfileDetails user={user} />
                </div>

                {/* Page footer */}
                <Footer />
            </main>
        </GradientBackground>
    );
};

export default ProfilePage;