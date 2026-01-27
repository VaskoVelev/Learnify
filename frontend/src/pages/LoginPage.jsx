import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthBrandPanel from "../components/auth/AuthBrandPanel";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [globalError, setGlobalError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setGlobalError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors({});

        try {
            await login(form);
            navigate("/");
        } catch (err) {
            setGlobalError(err.message);
            setFieldErrors(err.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = "w-full px-4 py-3 pl-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all";

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
                        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                        <p className="text-gray-400">Sign in to continue your learning journey</p>
                    </div>

                    {/* Global Error Display */}
                    {globalError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                            <p className="text-red-400 text-sm text-center">{globalError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className={`${inputStyle} ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                                    placeholder="Enter your email"
                                    disabled={isLoading}
                                />
                            </div>
                            {/* Field Error Message */}
                            {fieldErrors.email && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className={`${inputStyle} ${fieldErrors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                            </div>
                            {/* Field Error Message */}
                            {fieldErrors.password && (
                                <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 rounded-xl font-semibold text-gray-900 flex items-center justify-center gap-2 mt-8 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)"
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </span>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
