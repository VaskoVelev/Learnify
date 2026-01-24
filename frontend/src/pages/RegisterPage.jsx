import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user.api"
import { normalizeError } from "../lib/error";

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

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(form);
            navigate("/login");
        } catch (err) {
            setError(normalizeError(err));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" type="email" onChange={handleChange} />
            <input name="password" type="password" onChange={handleChange} />
            <input name="confirmPassword" type="password" onChange={handleChange} />
            <input name="firstName" onChange={handleChange} />
            <input name="lastName" onChange={handleChange} />
            <input name="role" onChange={handleChange} />
            {error && <p>{error}</p>}
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterPage;
