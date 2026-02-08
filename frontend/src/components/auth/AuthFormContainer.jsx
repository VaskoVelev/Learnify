const AuthFormContainer = ({ children, className = "" }) => {
    return (
        <div
            className={`w-full max-w-md p-8 rounded-2xl backdrop-blur-xl border border-white/10 ${className}`}
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                boxShadow: "0 8px 32px hsla(0, 0%, 0%, 0.4)"
            }}
        >
            {children}
        </div>
    );
};

export default AuthFormContainer;