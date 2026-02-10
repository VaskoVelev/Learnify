import { LogOut } from "lucide-react";

const LogoutButton = ({ onLogout }) => {
    return (
        <button
            onClick={onLogout}
            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
        </button>
    );
};

export default LogoutButton;