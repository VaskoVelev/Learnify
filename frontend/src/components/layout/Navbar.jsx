import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import NavButton from "./NavButton";
import LogoutButton from "./LogoutButton";

const Navbar = ({ onLogout, showHome = true, showCourses = true, showProfile = true }) => {
    return (
        <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/home" className="flex items-center gap-3 group">
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 group-hover:bg-white/15 group-hover:border-teal-500/30 transition-all duration-300">
                        <GraduationCap className="w-6 h-6 text-teal-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">
                        Learn<span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)" }}
                    >ify</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2">
                    {showHome && <NavButton to="/home" icon="Home" label="Home" />}
                    {showCourses && <NavButton to="/courses" icon="BookOpen" label="Courses" />}
                    {showProfile && <NavButton to="/profile" icon="User" label="Profile" />}
                    <LogoutButton onLogout={onLogout} />
                </nav>
            </div>
        </header>
    );
};

export default Navbar;