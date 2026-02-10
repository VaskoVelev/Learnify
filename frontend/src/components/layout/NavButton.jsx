import { Link } from "react-router-dom";
import * as Icons from "lucide-react";

const NavButton = ({ to, icon, label }) => {
    const Icon = Icons[icon];

    return (
        <Link
            to={to}
            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
        >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </Link>
    );
};

export default NavButton;