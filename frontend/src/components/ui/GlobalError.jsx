import { AlertCircle, XCircle } from "lucide-react";

const GlobalError = ({ error, onDismiss, type = "error", className = "" }) => {
    if (!error) {
        return null;
    }

    const styles = {
        error: {
            bg: "bg-red-500/10",
            border: "border-red-500/20",
            text: "text-red-400",
            icon: "text-red-400"
        },
        warning: {
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            text: "text-amber-400",
            icon: "text-amber-400"
        },
        success: {
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            text: "text-emerald-400",
            icon: "text-emerald-400"
        }
    };

    const style = styles[type] || styles.error;

    return (
        <div className={`mb-6 p-4 rounded-xl ${style.bg} ${style.border} backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300 ${className}`}>
            <AlertCircle className={`w-5 h-5 ${style.icon}`} />
            <p className={`${style.text} text-sm`}>{error}</p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className={`ml-auto ${style.text} hover:opacity-80`}
                >
                    <XCircle className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default GlobalError;