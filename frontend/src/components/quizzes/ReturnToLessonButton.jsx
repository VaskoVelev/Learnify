import { ArrowLeft } from "lucide-react";

const ReturnToLessonButton = ({ onClick, className = "" }) => {
    return (
        <div className={`mt-8 flex justify-center ${className}`}>
            <button
                onClick={onClick}
                className="px-6 py-3 rounded-xl font-semibold text-white transition-all inline-flex items-center gap-2"
                style={{
                    background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                    boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.3)"
                }}
            >
                <ArrowLeft className="w-4 h-4" />
                Return to Lesson
            </button>
        </div>
    );
};

export default ReturnToLessonButton;