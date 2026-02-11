import { ChevronDown } from "lucide-react";

const FilterDropdown = ({
    icon: Icon,
    value,
    onChange,
    options,
    placeholder = "All",
    iconColor = "text-teal-400",
    className = ""
}) => {
    return (
        <div className="relative">
            <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <Icon className={`w-4 h-4 ${iconColor}`} />
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="bg-transparent text-white/80 focus:outline-none cursor-pointer appearance-none pr-6"
                >
                    <option value="all" className="bg-gray-900 text-white">{placeholder}</option>
                    {options.filter(opt => opt !== "all").map((option) => (
                        <option key={option} value={option} className="bg-gray-900 text-white">
                            {option}
                        </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-white/40 absolute right-3" />
            </div>
        </div>
    );
};

export default FilterDropdown;