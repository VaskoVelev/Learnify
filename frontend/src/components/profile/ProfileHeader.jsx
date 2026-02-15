import { Settings } from "lucide-react";

const ProfileHeader = ({ user, onEdit, getInitials }) => {
    return (
        <div className="p-8 border-b border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white border border-white/20 shrink-0"
                style={{
                    background:
                        "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                }}
            >
                {getInitials(user?.firstName, user?.lastName)}
            </div>
            <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">
                    {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-white/60">{user?.email}</p>
                <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                    <span
                        className="px-3 py-1 rounded-lg text-sm font-medium border"
                        style={{
                            background: "hsla(174, 72%, 46%, 0.15)",
                            borderColor: "hsla(174, 72%, 46%, 0.3)",
                            color: "hsl(174, 72%, 56%)",
                        }}
                    >
                        {user?.role}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                    </span>
                </div>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
                    style={{
                        background:
                            "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                        boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)",
                    }}
                >
                    <Settings className="w-4 h-4" />
                    Update Account
                </button>
            )}
        </div>
    );
};

export default ProfileHeader;