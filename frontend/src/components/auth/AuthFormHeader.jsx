const AuthFormHeader = ({ title, subtitle, className = "" }) => {
    return (
        <div className={`text-center mb-8 ${className}`}>
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            <p className="text-gray-400">{subtitle}</p>
        </div>
    );
};

export default AuthFormHeader;