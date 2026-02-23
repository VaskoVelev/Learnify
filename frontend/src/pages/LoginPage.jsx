import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";
import {
    GlobalError,
    FieldError,
    AuthBrandPanel,
    AuthButton,
    AuthInput,
    AuthFormContainer,
    AuthFormHeader,
    AuthLink
} from "../components";

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

        if (fieldErrors[e.target.name]) {
            setFieldErrors({ ...fieldErrors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors({});

        try {
            await login(form);
            navigate("/home");
        } catch (err) {
            setGlobalError(err.message);
            setFieldErrors(err.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    const handleDismissError = () => {
        setGlobalError(null);
        setFieldErrors({});
    };

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)" }}>

            {/* Left side brand panel */}
            <AuthBrandPanel />

            {/* Right side form section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <AuthFormContainer>

                    {/* Header with title and subtitle */}
                    <AuthFormHeader
                        title="Welcome Back"
                        subtitle="Sign in to continue your learning journey"
                    />

                    {/* Error message display */}
                    <GlobalError
                        error={globalError}
                        onDismiss={handleDismissError}
                        type="error"
                    />

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <AuthInput
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                icon={Mail}
                                error={fieldErrors.email}
                                disabled={isLoading}
                            />
                            <FieldError error={fieldErrors.email} />
                        </div>

                        {/* Password field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <AuthInput
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                icon={Lock}
                                error={fieldErrors.password}
                                disabled={isLoading}
                            />
                            <FieldError error={fieldErrors.password} />
                        </div>

                        {/* Submit button */}
                        <AuthButton
                            isLoading={isLoading}
                            className="mt-8"
                        >
                            Sign In
                        </AuthButton>
                    </form>

                    {/* Link to register page */}
                    <AuthLink
                        text="Don't have an account?"
                        linkText="Create one"
                        to="/register"
                        className="mt-8"
                    />
                </AuthFormContainer>
            </div>
        </div>
    );
};

export default LoginPage;