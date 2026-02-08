import { ArrowRight } from "lucide-react";

const AuthButton = ({
    type = "submit",
    children,
    isLoading = false,
    disabled = false,
    className = "",
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled || isLoading}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-gray-900 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
            style={{
                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)"
            }}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {children}...
                </span>
            ) : (
                <>
                    {children}
                    <ArrowRight className="w-5 h-5" />
                </>
            )}
        </button>
    );
};

export default AuthButton;