import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user.api"

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

    const renderInput = (label, name, type = "text", placeholder) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                name={name}
                type={type}
                required
                value={form[name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors[name] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={placeholder}
            />
            {fieldErrors[name] && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors[name]}</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Създаване на акаунт</h2>
                    <p className="mt-2 text-gray-600">
                        Вече имате акаунт?{" "}
                        <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                            Влезте тук
                        </a>
                    </p>
                </div>

                <form className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        {globalError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                {globalError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("Име", "firstName", "text", "Иван")}
                            {renderInput("Фамилия", "lastName", "text", "Иванов")}
                        </div>

                        {renderInput("Имейл", "email", "email", "ваш@имейл.com")}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Роля</label>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="STUDENT">Студент</option>
                                <option value="TEACHER">Преподавател</option>
                                <option value="ADMIN">Администратор</option>
                            </select>
                        </div>

                        {renderInput("Парола", "password", "password", "••••••••")}
                        {renderInput("Потвърдете паролата", "confirmPassword", "password", "••••••••")}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? "Регистриране..." : "Създай акаунт"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
