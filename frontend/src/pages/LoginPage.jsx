import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { normalizeError } from "../lib/error";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form);
            navigate("/");
        } catch (err) {
            setError(normalizeError(err));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="email" type="email" onChange={handleChange} />
            <input name="password" type="password" onChange={handleChange} />
            {error && <p>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginPage;
