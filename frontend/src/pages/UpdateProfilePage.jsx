import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateMe } from "../api/user.api";
import {
    GraduationCap,
    LogOut,
    Home,
    User,
    Mail,
    Calendar,
    Shield,
    CheckCircle,
    Save,
    X,
    ArrowLeft
} from "lucide-react";

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
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }

        setGlobalError(null);
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

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300";

    return (
        <div
            className="min-h-screen"
            style={{
                background:
                    "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)",
            }}
        >
            {/* Floating orbs */}
            <div className="fixed w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-15 -top-32 -left-32 pointer-events-none" />
            <div className="fixed w-80 h-80 bg-cyan-500 rounded-full blur-[100px] opacity-15 bottom-20 right-10 pointer-events-none" />
            <div className="fixed w-64 h-64 bg-teal-400 rounded-full blur-[80px] opacity-10 top-1/2 left-1/3 pointer-events-none" />
            <div className="fixed w-48 h-48 bg-blue-500 rounded-full blur-[60px] opacity-10 top-1/4 right-1/4 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/home" className="flex items-center gap-3 group">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 group-hover:bg-white/15 group-hover:border-teal-500/30 transition-all duration-300">
                            <GraduationCap className="w-6 h-6 text-teal-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Learn<span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)" }}
                        >ify</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link
                            to="/home"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-2xl mx-auto px-6 py-12">
                {/* Back Link */}
                <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Profile
                </Link>

                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Update Profile</h1>
                    <p className="text-white/60 text-lg">
                        Edit your account information
                    </p>
                </div>

                {/* Global Error Display */}
                {globalError && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
                        <p className="text-red-400 text-sm text-center">{globalError}</p>
                    </div>
                )}

                {/* Update Form Card */}
                <div
                    className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                    }}
                >
                    {/* User Info Header */}
                    <div className="p-8 border-b border-white/10 flex flex-col sm:flex-row items-center gap-6">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border border-white/20 shrink-0"
                            style={{
                                background:
                                    "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                            }}
                        >
                            {getInitials(form.firstName, form.lastName)}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {form.firstName} {form.lastName}
                            </h2>
                            <p className="text-white/60">{user?.email}</p>
                            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                                <span
                                    className="px-3 py-1 rounded-lg text-sm font-medium border"
                                    style={{
                                        background: "hsla(174, 72%, 46%, 0.15)",
                                        borderColor: "hsla(174, 72%, 46%, 0.3)",
                                        color: "hsl(174, 72%, 56%)",
                                    }}
                                >
                                    {user?.role}
                                </span>
                                <span className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className={`${inputStyle} pl-12 ${fieldErrors.firstName ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                                        placeholder="Enter your first name"
                                        disabled={isSaving}
                                    />
                                </div>
                                {/* Field Error Message */}
                                {fieldErrors.firstName && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors.firstName}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        className={`${inputStyle} pl-12 ${fieldErrors.lastName ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                                        placeholder="Enter your last name"
                                        disabled={isSaving}
                                    />
                                </div>
                                {/* Field Error Message */}
                                {fieldErrors.lastName && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-white/10">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                                style={{
                                    background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                    boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)",
                                }}
                            >
                                {isSaving ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </span>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* Footer Section */}
            <footer className="relative z-10 border-t border-white/10 mt-12">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-teal-400" />
                            <span className="text-white/60 text-sm">
                                © 2026 Learnify. Keep learning, keep growing.
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                Help Center
                            </a>
                            <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                Privacy
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default UpdateProfilePage;
