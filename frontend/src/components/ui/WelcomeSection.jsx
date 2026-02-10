const WelcomeSection = ({
    user,
    title = "Hello",
    subtitle = "Continue your learning journey. You're making great progress!",
    className = ""
}) => {
    return (
        <div className={className}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                {title}, <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 56%) 0%, hsl(199, 89%, 58%) 100%)" }}
            >{user?.firstName}</span>!
            </h1>
            <p className="text-white/60 text-base sm:text-lg max-w-xl">
                {subtitle}
            </p>
        </div>
    );
};

export default WelcomeSection;