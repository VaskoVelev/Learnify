import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/user.api"
import { Mail, Lock, User, ArrowRight, BookMarked, AlertCircle, XCircle } from "lucide-react";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        role: "STUDENT",
    });

    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleRoleChange = (role) => {
        setForm({ ...form, role: role === "student" ? "STUDENT" : "TEACHER" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors({});

        try {
            await registerUser(form);
            navigate("/login");
        } catch (err) {
            setGlobalError(err.message);
            setFieldErrors(err.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all";

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)" }}>
            {/* Reusable Brand Panel */}
            <AuthBrandPanel />

            {/* Form Panel - Right Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div
                    className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border border-white/10"
                    style={{
                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                        boxShadow: "0 8px 32px hsla(0, 0%, 0%, 0.4)"
                    }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Create account</h2>
                        <p className="text-gray-400">Join thousands of learners today</p>
                    </div>

                    {/* Global Error Display */}
                    {globalError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-400 text-sm">{globalError}</p>
                            <button
                                onClick={() => {
                                    setGlobalError(null);
                                    setFieldErrors({});
                                }}
                                className="ml-auto text-red-400 hover:text-red-300"
                            >
                                <XCircle className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-400 mb-2">I am a</label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange("student")}
                                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                                        form.role === "STUDENT"
                                            ? "border-teal-500 bg-teal-500/10"
                                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                    }`}
                                    style={form.role === "STUDENT" ? { boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)" } : {}}
                                >
                                    <svg className={`w-6 h-6 mx-auto mb-2 ${form.role === "STUDENT" ? "text-teal-400" : "text-white/60"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6l9-5M12 20l-9-5"></path>
                                    </svg>
                                    <span className={`font-semibold ${form.role === "STUDENT" ? "text-teal-400" : "text-white/80"}`}>Student</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange("teacher")}
                                    className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                                        form.role === "TEACHER"
                                            ? "border-teal-500 bg-teal-500/10"
                                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                                    }`}
                                    style={form.role === "TEACHER" ? { boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)" } : {}}
                                >
                                    <BookMarked className={`w-6 h-6 mx-auto mb-2 ${form.role === "TEACHER" ? "text-teal-400" : "text-white/60"}`} />
                                    <span className={`font-semibold ${form.role === "TEACHER" ? "text-teal-400" : "text-white/80"}`}>Teacher</span>
                                </button>
                            </div>
                        </div>

                        {/* Name fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        className={`${inputStyle} ${fieldErrors.firstName ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''} pl-12`}
                                        placeholder="John"
                                    />
                                </div>
                                {fieldErrors.firstName && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    className={`${inputStyle} ${fieldErrors.lastName ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                                    placeholder="Doe"
                                />
                                {fieldErrors.lastName && (
                                    <p className="mt-1 text-sm text-red-400">{fieldErrors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`${inputStyle} ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''} pl-12`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`${inputStyle} ${fieldErrors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''} pl-12`}
                                    placeholder="Create a password"
                                />
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className={`${inputStyle} ${fieldErrors.confirmPassword ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''} pl-12`}
                                    placeholder="Confirm your password"
                                />
                            </div>
                            {fieldErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 rounded-xl font-semibold text-gray-900 flex items-center justify-center gap-2 mt-6 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)"
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
