import { ChevronRight } from "lucide-react";

const BackButton = ({ onClick, className = "" }) => {
    return (
        <div className={`mb-8 ${className}`}>
            <button
                onClick={onClick}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
                <ChevronRight className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                Back to Course
            </button>
        </div>
    );
};

export default BackButton;