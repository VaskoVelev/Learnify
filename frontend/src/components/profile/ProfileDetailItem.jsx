const ProfileDetailItem = ({ icon: Icon, label, value, valueColor = "text-white", iconBg = "bg-teal-500/20", iconColor = "text-teal-400" }) => {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <span className="text-sm text-white/50">{label}</span>
            </div>
            <p className={`${valueColor} font-medium pl-11`}>{value}</p>
        </div>
    );
};

export default ProfileDetailItem;