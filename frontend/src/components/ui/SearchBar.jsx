import { Search, X } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search...", className = "" }) => {
    return (
        <div className="flex-1">
            <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <Search className="w-4 h-4 text-teal-400" />
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                    />
                    {value && (
                        <button
                            onClick={() => onChange("")}
                            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-4 h-4 text-white/40" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchBar;