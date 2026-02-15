import { CheckCircle } from "lucide-react";

const QuestionCard = ({
                          question,
                          index,
                          selectedAnswer,
                          onSelectAnswer,
                          isSubmitted = false,
                          letters = ["A", "B", "C", "D"]
                      }) => {
    // Safety check - if question or answers is undefined, don't render
    if (!question || !question.answers || !Array.isArray(question.answers)) {
        return null;
    }

    const isAnswered = !!selectedAnswer;

    return (
        <div
            className="rounded-2xl backdrop-blur-xl border transition-all duration-300 overflow-hidden"
            style={{
                borderColor: isAnswered ? "hsla(174, 72%, 46%, 0.25)" : "hsla(0, 0%, 100%, 0.1)",
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.07) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            {/* Question header bar */}
            <div
                className="px-6 py-4 flex items-center gap-4 border-b"
                style={{
                    borderColor: isAnswered ? "hsla(174, 72%, 46%, 0.15)" : "hsla(0, 0%, 100%, 0.07)",
                    background: isAnswered
                        ? "linear-gradient(135deg, hsla(174, 72%, 46%, 0.1) 0%, hsla(199, 89%, 48%, 0.05) 100%)"
                        : "hsla(0, 0%, 100%, 0.03)",
                }}
            >
                <span
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all duration-300"
                    style={{
                        background: isAnswered
                            ? "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                            : "hsla(0, 0%, 100%, 0.08)",
                        color: isAnswered ? "white" : "hsla(0, 0%, 100%, 0.4)",
                        boxShadow: isAnswered ? "0 0 20px hsla(174, 72%, 46%, 0.3)" : "none",
                    }}
                >
                    {index + 1}
                </span>
                <h3 className="text-white font-semibold text-base sm:text-lg leading-snug flex-1">
                    {question.text}
                </h3>
                {isAnswered && (
                    <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 animate-scale-in" />
                )}
            </div>

            {/* Answers in 2x2 grid */}
            <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.answers.map((answer, aIndex) => {
                        const isSelected = selectedAnswer === answer.id;
                        return (
                            <button
                                key={answer.id}
                                onClick={() => onSelectAnswer(question.id, answer.id)}
                                disabled={isSubmitted}
                                className={`relative text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group ${
                                    isSubmitted ? "cursor-default" : "cursor-pointer"
                                }`}
                                style={{
                                    borderColor: isSelected ? "hsla(174, 72%, 46%, 0.5)" : "hsla(0, 0%, 100%, 0.08)",
                                    background: isSelected
                                        ? "linear-gradient(135deg, hsla(174, 72%, 46%, 0.12) 0%, hsla(199, 89%, 48%, 0.06) 100%)"
                                        : "hsla(0, 0%, 100%, 0.03)",
                                    boxShadow: isSelected ? "0 0 25px hsla(174, 72%, 46%, 0.1), inset 0 1px 0 hsla(174, 72%, 46%, 0.1)" : "none",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected && !isSubmitted) {
                                        e.currentTarget.style.borderColor = "hsla(0, 0%, 100%, 0.2)";
                                        e.currentTarget.style.background = "hsla(0, 0%, 100%, 0.06)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.borderColor = "hsla(0, 0%, 100%, 0.08)";
                                        e.currentTarget.style.background = "hsla(0, 0%, 100%, 0.03)";
                                    }
                                }}
                            >
                                {/* Letter badge */}
                                <span
                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-all duration-200"
                                    style={{
                                        background: isSelected
                                            ? "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                                            : "hsla(0, 0%, 100%, 0.08)",
                                        color: isSelected ? "white" : "hsla(0, 0%, 100%, 0.45)",
                                        boxShadow: isSelected ? "0 0 12px hsla(174, 72%, 46%, 0.3)" : "none",
                                    }}
                                >
                                    {letters[aIndex]}
                                </span>
                                <span className={`text-sm font-medium transition-colors duration-200 ${isSelected ? "text-white" : "text-white/60 group-hover:text-white/90"}`}>
                                    {answer.text}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;