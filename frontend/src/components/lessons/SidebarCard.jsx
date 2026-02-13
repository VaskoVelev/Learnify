const SidebarCard = ({ icon: Icon, title, children, iconColor = "text-teal-400" }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Icon className={`w-5 h-5 ${iconColor}`} />
                {title}
            </h3>
            {children}
        </div>
    );
};

export default SidebarCard;