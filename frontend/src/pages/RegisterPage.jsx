import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user.api";
import { Mail, Lock, User } from "lucide-react";
import {
    GlobalError,
    FieldError,
    AuthBrandPanel,
    AuthButton,
    AuthInput,
    AuthRoleSelector,
    AuthFormContainer,
    AuthFormHeader,
    AuthLink
} from "../components";

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
        setForm({ ...form, role });
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

    const handleDismissError = () => {
        setGlobalError(null);
        setFieldErrors({});
    };

    return (
        <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)" }}>
            <AuthBrandPanel />

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <AuthFormContainer>
                    <AuthFormHeader
                        title="Create account"
                        subtitle="Join thousands of learners today"
                    />

                    <GlobalError
                        error={globalError}
                        onDismiss={handleDismissError}
                        type="error"
                    />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AuthRoleSelector
                            value={form.role}
                            onChange={handleRoleChange}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                                <AuthInput
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    icon={User}
                                    error={fieldErrors.firstName}
                                    disabled={isLoading}
                                />
                                <FieldError error={fieldErrors.firstName} />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                                <AuthInput
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    error={fieldErrors.lastName}
                                    disabled={isLoading}
                                />
                                <FieldError error={fieldErrors.lastName} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                            <AuthInput
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                icon={Mail}
                                error={fieldErrors.email}
                                disabled={isLoading}
                            />
                            <FieldError error={fieldErrors.email} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <AuthInput
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                icon={Lock}
                                error={fieldErrors.password}
                                disabled={isLoading}
                            />
                            <FieldError error={fieldErrors.password} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                            <AuthInput
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                icon={Lock}
                                error={fieldErrors.confirmPassword}
                                disabled={isLoading}
                            />
                            <FieldError error={fieldErrors.confirmPassword} />
                        </div>

                        <AuthButton
                            isLoading={isLoading}
                            className="mt-6"
                        >
                            Create Account
                        </AuthButton>
                    </form>

                    <AuthLink
                        text="Already have an account?"
                        linkText="Sign in"
                        to="/login"
                        className="mt-6"
                    />
                </AuthFormContainer>
            </div>
        </div>
    );
};

export default RegisterPage;