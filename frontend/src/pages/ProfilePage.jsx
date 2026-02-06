import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    GraduationCap,
    LogOut,
    Home,
    User,
    Mail,
    Calendar,
    Shield,
    CheckCircle,
    XCircle,
    Settings,
    BookOpen,
    AlertCircle
} from "lucide-react";

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

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-white/60 text-lg">
                        Manage your account information
                    </p>
                </div>

                {/* Profile Card */}
                <div
                    className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                    }}
                >
                    {/* Profile Header with Avatar */}
                    <div className="p-8 border-b border-white/10 flex flex-col sm:flex-row items-center gap-6">
                        <div
                            className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border border-white/20 shrink-0"
                            style={{
                                background:
                                    "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                            }}
                        >
                            {getInitials(user?.firstName, user?.lastName)}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-white mb-1">
                                {user?.firstName} {user?.lastName}
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
                        <button
                            onClick={() => navigate("/profile/edit")}
                            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
                            style={{
                                background:
                                    "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)",
                            }}
                        >
                            <Settings className="w-4 h-4" />
                            Update Account
                        </button>
                    </div>

                    {/* Profile Details */}
                    <div className="p-8">
                        <h3 className="text-lg font-semibold text-white mb-6">
                            Account Details
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {/* First Name */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-teal-500/20">
                                        <User className="w-4 h-4 text-teal-400" />
                                    </div>
                                    <span className="text-sm text-white/50">First Name</span>
                                </div>
                                <p className="text-white font-medium pl-11">
                                    {user?.firstName}
                                </p>
                            </div>

                            {/* Last Name */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-teal-500/20">
                                        <User className="w-4 h-4 text-teal-400" />
                                    </div>
                                    <span className="text-sm text-white/50">Last Name</span>
                                </div>
                                <p className="text-white font-medium pl-11">
                                    {user?.lastName}
                                </p>
                            </div>

                            {/* Email */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-cyan-500/20">
                                        <Mail className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <span className="text-sm text-white/50">Email Address</span>
                                </div>
                                <p className="text-white font-medium pl-11">
                                    {user?.email}
                                </p>
                            </div>

                            {/* Role */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-purple-500/20">
                                        <Shield className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="text-sm text-white/50">Account Role</span>
                                </div>
                                <p className="text-white font-medium pl-11">
                                    {user?.role}
                                </p>
                            </div>

                            {/* Created At */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-amber-500/20">
                                        <Calendar className="w-4 h-4 text-amber-400" />
                                    </div>
                                    <span className="text-sm text-white/50">Member Since</span>
                                </div>
                                <p className="text-white font-medium pl-11">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-emerald-500/20">
                                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-white/50">Account Status</span>
                                </div>
                                <p className="text-emerald-400 font-medium pl-11">
                                    Active
                                </p>
                            </div>
                        </div>
                    </div>
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

export default ProfilePage;
