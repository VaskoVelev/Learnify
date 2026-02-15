import { CheckCircle, XCircle } from "lucide-react";

const ReviewQuestionCard = ({ answer, index }) => {
    const isCorrect = answer.correct;

    return (
        <div
            className="rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden"
            style={{
                borderColor: isCorrect
                    ? "hsla(160, 84%, 50%, 0.25)"
                    : "hsla(0, 84%, 60%, 0.25)",
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.07) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            {/* Question header bar */}
            <div
                className="px-6 py-4 flex items-center gap-4 border-b"
                style={{
                    borderColor: isCorrect
                        ? "hsla(160, 84%, 50%, 0.15)"
                        : "hsla(0, 84%, 60%, 0.15)",
                    background: isCorrect
                        ? "linear-gradient(135deg, hsla(160, 84%, 50%, 0.1) 0%, hsla(160, 84%, 50%, 0.05) 100%)"
                        : "linear-gradient(135deg, hsla(0, 84%, 60%, 0.1) 0%, hsla(0, 84%, 60%, 0.05) 100%)",
                }}
            >
                <span
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                    style={{
                        background: isCorrect
                            ? "linear-gradient(135deg, hsl(160, 84%, 50%) 0%, hsl(160, 84%, 40%) 100%)"
                            : "linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 84%, 50%) 100%)",
                        color: "white",
                        boxShadow: isCorrect
                            ? "0 0 20px hsla(160, 84%, 50%, 0.3)"
                            : "0 0 20px hsla(0, 84%, 60%, 0.3)",
                    }}
                >
                    {index + 1}
                </span>
                <h3 className="text-white font-semibold text-base sm:text-lg leading-snug flex-1">
                    {answer.questionText}
                </h3>
                {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                )}
            </div>

            {/* Answer Review Section */}
            <div className="p-6 space-y-4">
                {/* Your Answer */}
                <div>
                    <div className="text-sm text-white/40 mb-2">Your answer:</div>
                    <div
                        className="flex items-center gap-3 p-4 rounded-xl border-2"
                        style={{
                            borderColor: isCorrect
                                ? "hsla(160, 84%, 50%, 0.5)"
                                : "hsla(0, 84%, 60%, 0.5)",
                            background: isCorrect
                                ? "linear-gradient(135deg, hsla(160, 84%, 50%, 0.12) 0%, hsla(160, 84%, 50%, 0.06) 100%)"
                                : "linear-gradient(135deg, hsla(0, 84%, 60%, 0.12) 0%, hsla(0, 84%, 60%, 0.06) 100%)",
                        }}
                    >
                        <span className="text-white font-medium flex-1">
                            {answer.chosenAnswerText}
                        </span>
                        {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        ) : (
                            <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                    </div>
                </div>

                {/* Correct Answer - Always shown */}
                <div>
                    <div className="text-sm text-white/40 mb-2">Correct answer:</div>
                    <div
                        className="flex items-center gap-3 p-4 rounded-xl border-2"
                        style={{
                            borderColor: "hsla(160, 84%, 50%, 0.5)",
                            background: "linear-gradient(135deg, hsla(160, 84%, 50%, 0.12) 0%, hsla(160, 84%, 50%, 0.06) 100%)",
                        }}
                    >
                        <span className="text-white font-medium flex-1">
                            {answer.correctAnswerText || "Correct answer text not available"}
                        </span>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewQuestionCard;