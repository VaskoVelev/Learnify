import { Sparkles } from "lucide-react";

const WelcomeBadge = ({ text = "Welcome back", icon: Icon = Sparkles, className = "" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                <Icon className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs font-medium text-teal-400">{text}</span>
            </div>
        </div>
    );
};

export default WelcomeBadge;