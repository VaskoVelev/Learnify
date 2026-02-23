import { AlertCircle } from "lucide-react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Delete",
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger"
}) => {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-rose-500/20",
            text: "text-rose-400",
            border: "border-rose-500/30",
            hover: "hover:bg-rose-500/30",
            icon: <AlertCircle className="w-6 h-6 text-rose-400" />
        },
        warning: {
            bg: "bg-amber-500/20",
            text: "text-amber-400",
            border: "border-amber-500/30",
            hover: "hover:bg-amber-500/30",
            icon: <AlertCircle className="w-6 h-6 text-amber-400" />
        }
    };

    const style = colors[type] || colors.danger;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="max-w-md w-full rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{
                    background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${style.bg}`}>
                        {style.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>

                <p className="text-white/60 mb-6">
                    {message}
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white ${style.bg} ${style.hover} border ${style.border} transition-all`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;