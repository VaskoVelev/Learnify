import { Link } from "react-router-dom";

const AuthLink = ({ text, linkText, to, className = "" }) => {
    return (
        <p className={`text-center mt-6 text-gray-400 ${className}`}>
            {text}{" "}
            <Link to={to} className="text-teal-400 hover:text-teal-300 font-semibold transition-colors">
                {linkText}
            </Link>
        </p>
    );
};

export default AuthLink;