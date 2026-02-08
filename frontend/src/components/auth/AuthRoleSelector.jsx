import { BookMarked } from "lucide-react";

const AuthRoleSelector = ({ value, onChange }) => {
    const StudentIcon = ({ className = "", ...props }) => (
        <svg
            className={`w-6 h-6 ${className}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14v6l9-5M12 20l-9-5"></path>
        </svg>
    );

    const roles = [
        {
            id: "STUDENT",
            label: "Student",
            icon: StudentIcon
        },
        {
            id: "TEACHER",
            label: "Teacher",
            icon: BookMarked
        }
    ];

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">I am a</label>
            <div className="flex gap-3">
                {roles.map((role) => {
                    const isSelected = value === role.id;
                    const Icon = role.icon;

                    return (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => onChange(role.id)}
                            className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${
                                isSelected
                                    ? "border-teal-500 bg-teal-500/10"
                                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            }`}
                            style={isSelected ? { boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)" } : {}}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <Icon
                                    className={`w-6 h-6 mb-2 ${isSelected ? "text-teal-400" : "text-white/60"}`}
                                />
                                <span className={`font-semibold ${isSelected ? "text-teal-400" : "text-white/80"}`}>
                                    {role.label}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AuthRoleSelector;