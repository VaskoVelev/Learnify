const GradientBackground = ({ children, className = "" }) => {
    return (
        <div
            className={`min-h-screen ${className}`}
            style={{
                background: "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)"
            }}
        >
            {children}
        </div>
    );
};

export default GradientBackground;