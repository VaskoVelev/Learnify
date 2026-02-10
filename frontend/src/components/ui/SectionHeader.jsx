const SectionHeader = ({
    icon: Icon,
    title,
    action = null,
    className = ""
}) => {
    return (
        <div className={`flex items-center justify-between mb-6 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                    <Icon className="w-5 h-5 text-teal-400" />
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-white">{title}</h2>
            </div>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
};

export default SectionHeader;