import { HelpCircle, ChevronRight } from "lucide-react";

const QuizzesList = ({ quizzes, onQuizClick }) => {
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
            {quizzes.map((quiz) => (
                <button
                    key={quiz?.id}
                    onClick={() => onQuizClick(quiz?.id)}
                    className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all group"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <h4 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                                {quiz?.title}
                            </h4>
                            <p className="text-white/50 text-sm mt-1">
                                {quiz?.description}
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-1" />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default QuizzesList;