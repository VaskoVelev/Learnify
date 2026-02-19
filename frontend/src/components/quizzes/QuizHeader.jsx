import { Sparkles, Edit2, Trash2, History } from "lucide-react";

const QuizHeader = ({ title, description, totalQuestions, onEdit, onDelete, onViewSubmissions, hasSubmissions = false }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
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
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Previous Submissions button - only shows if student has submissions */}
                        {hasSubmissions && onViewSubmissions && (
                            <button
                                onClick={onViewSubmissions}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all text-sm font-medium border border-purple-500/30 shrink-0"
                            >
                                <History className="w-4 h-4" />
                                Previous Submissions
                            </button>
                        )}

                        {/* Teacher buttons - only show for teachers */}
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all text-sm font-medium border border-amber-500/30 shrink-0"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Quiz
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all text-sm font-medium border border-rose-500/30"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Quiz
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizHeader;