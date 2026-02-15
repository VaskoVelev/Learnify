import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../api/user.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    ProfileHeader,
    ProfileForm
} from "../components";

const UpdateProfilePage = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
    });

    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors({});

        try {
            await logout();
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSaving(true);
        setGlobalError(null);
        setFieldErrors({});

        try {
            await updateMe(form);

            updateUser({
                firstName: form.firstName,
                lastName: form.lastName,
            });

            navigate("/profile");
        } catch (err) {
            setGlobalError(err.message);
            setFieldErrors(err.errors);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        navigate("/profile");
    };

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={true}
                showProfile={false}
            />

            <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
                <PageHeader
                    title="Update Profile"
                    subtitle="Edit your account information"
                />

                <GlobalError
                    error={globalError}
                    onDismiss={() => {
                        setGlobalError(null);
                        setFieldErrors({});
                    }}
                    type="error"
                />

                <div
                    className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                    style={{
                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                    }}
                >
                    <ProfileHeader user={{ ...user, firstName: form.firstName, lastName: form.lastName }} />

                    <ProfileForm
                        form={form}
                        fieldErrors={fieldErrors}
                        isSaving={isSaving}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default UpdateProfilePage;