import { CheckCircle } from "lucide-react";

const QuizSubmissionBanner = ({ className = "" }) => {
    return (
        <div
            className={`rounded-2xl backdrop-blur-xl border border-teal-500/30 p-6 mb-8 flex items-center gap-4 ${className}`}
            style={{
                background: "linear-gradient(145deg, hsla(174, 72%, 46%, 0.15) 0%, hsla(199, 89%, 48%, 0.05) 100%)",
            }}
        >
            <CheckCircle className="w-6 h-6 text-teal-400 shrink-0" />
            <div>
                <h3 className="text-white font-semibold">Quiz Submitted!</h3>
                <p className="text-white/60 text-sm">
                    Your answers have been recorded. You can review your selections below.
                </p>
            </div>
        </div>
    );
};

export default QuizSubmissionBanner;