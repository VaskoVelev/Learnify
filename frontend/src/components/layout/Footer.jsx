import { GraduationCap } from "lucide-react";

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-white/10 mt-12 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-teal-400" />
                    <span className="text-white/60 text-sm">
                        © 2026 Learnify. Keep learning, keep growing.
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                        Help Center
                    </a>
                    <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                        Terms
                    </a>
                    <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;