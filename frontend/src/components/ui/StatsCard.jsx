const StatsCard = ({
    icon: Icon,
    label,
    value,
    color = "teal",
    gradient = "linear-gradient(145deg, hsla(174, 70%, 40%, 0.15) 0%, hsla(174, 70%, 40%, 0.05) 100%)",
    className = "",
    hiddenOnMobile = false
}) => {
    const colorClasses = {
        teal: "text-teal-400",
        cyan: "text-cyan-400",
        amber: "text-amber-400",
        emerald: "text-emerald-400",
        rose: "text-rose-400",
        purple: "text-purple-400",
        blue: "text-blue-400"
    };

    return (
        <div
            className={`${hiddenOnMobile ? 'hidden sm:block' : ''} flex-1 sm:flex-none sm:w-36 p-4 rounded-2xl border border-white/10 backdrop-blur-xl ${className}`}
            style={{ background: gradient }}
        >
            <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${colorClasses[color]}`} />
                <span className="text-xs text-white/50 uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
        </div>
    );
};

export default StatsCard;