import { HelpCircle, ChevronRight, CheckCircle, RotateCcw } from "lucide-react";

const QuizzesList = ({ quizzes, onQuizClick, quizSubmissions = {} }) => {
    if (quizzes.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <HelpCircle className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/60 text-sm">No quizzes available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {quizzes.map((quiz) => {
                const isCompleted = quizSubmissions[quiz.id];

                return (
                    <button
                        key={quiz?.id}
                        onClick={() => onQuizClick(quiz?.id)}
                        className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all group relative overflow-hidden"
                    >
                        {/* Completed indicator background */}
                        {isCompleted && (
                            <div
                                className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{
                                    background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                                }}
                            />
                        )}

                        <div className="flex items-start justify-between gap-3 relative">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                                        {quiz?.title}
                                    </h4>
                                    {isCompleted && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            <CheckCircle className="w-3 h-3" />
                                            Completed
                                        </span>
                                    )}
                                </div>
                                <p className="text-white/50 text-sm mt-1">
                                    {quiz?.description}
                                </p>
                                {isCompleted && (
                                    <p className="text-emerald-400/70 text-xs mt-2 flex items-center gap-1">
                                        <RotateCcw className="w-3 h-3" />
                                        You can retake this quiz
                                    </p>
                                )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-1" />
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default QuizzesList;