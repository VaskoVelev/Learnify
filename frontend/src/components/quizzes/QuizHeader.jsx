import { HelpCircle } from "lucide-react";

const QuizHeader = ({ title, description, totalQuestions, answeredCount }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                        <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-xs font-medium text-teal-400">Quiz</span>
                    </div>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                    {title}
                </h1>

                <p className="text-white/60 text-base sm:text-lg max-w-3xl mb-4">
                    {description}
                </p>

                <div className="flex items-center gap-4">
                    <span className="text-white/40 text-sm">{totalQuestions} questions</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40 text-sm">{answeredCount}/{totalQuestions} answered</span>
                </div>
            </div>
        </div>
    );
};

export default QuizHeader;