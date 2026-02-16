import { PlusCircle } from "lucide-react";

const CreateCourseButton = ({ onClick, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className={`group relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-white transition-all duration-300 overflow-hidden ${className}`}
            style={{
                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                boxShadow: "0 4px 15px hsla(174, 72%, 46%, 0.2), 0 0 0 1px hsla(174, 72%, 46%, 0.3) inset",
            }}
        >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Glow effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl opacity-0 group-hover:opacity-50 blur transition-opacity duration-300 -z-10" />

            <PlusCircle className="w-4 h-4 transition-transform group-hover:scale-110 group-hover:rotate-90 duration-300" />
            <span className="relative">Create Course</span>

            {/* Subtle pulse animation on hover */}
            <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
        </button>
    );
};

export default CreateCourseButton;