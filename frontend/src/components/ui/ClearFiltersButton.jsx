import { X } from "lucide-react";

const ClearFiltersButton = ({ onClick, className = "" }) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-2"
        >
            <X className="w-4 h-4" />
            <span>Clear</span>
        </button>
    );
};

export default ClearFiltersButton;