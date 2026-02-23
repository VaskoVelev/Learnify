import { useState } from "react";
import { HelpCircle, ChevronRight, CheckCircle, RotateCcw, Search, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";

const QuizzesList = ({ quizzes, onQuizClick, quizSubmissions = {}, showAddButton = false, onAddClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    if (quizzes.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-500/20">
                            <HelpCircle className="w-5 h-5 text-teal-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Quizzes</h3>
                    </div>
                    {showAddButton && (
                        <button
                            onClick={onAddClick}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Quiz
                        </button>
                    )}
                </div>
                <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No quizzes available</p>
                </div>
            </div>
        );
    }

    const hasMoreThanThree = quizzes.length > 3;

    const displayedQuizzes = isExpanded ? quizzes : quizzes.slice(0, 3);

    const filteredQuizzes = searchTerm && isExpanded
        ? displayedQuizzes.filter(quiz =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : displayedQuizzes;

    return (
        <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                        <HelpCircle className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Quizzes</h3>
                </div>
                {showAddButton && (
                    <button
                        onClick={onAddClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Quiz
                    </button>
                )}
            </div>

            {/* Search Bar */}
            {isExpanded && hasMoreThanThree && (
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/30 text-sm"
                    />
                </div>
            )}

            {/* Quizzes List */}
            <div className={`space-y-3 ${isExpanded ? 'max-h-[300px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz) => {
                        const isCompleted = quizSubmissions[quiz.id];

                        return (
                            <button
                                key={quiz?.id}
                                onClick={() => onQuizClick(quiz?.id)}
                                className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all group relative overflow-hidden"
                            >
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
                                            <h4 className="text-white font-medium group-hover:text-teal-400 transition-colors">
                                                {quiz?.title}
                                            </h4>
                                            {isCompleted && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-white/50 text-sm mt-1 line-clamp-2">
                                            {quiz?.description}
                                        </p>
                                        {isCompleted && (
                                            <p className="text-emerald-400/70 text-xs mt-2 flex items-center gap-1">
                                                <RotateCcw className="w-3 h-3" />
                                                You can retake this quiz
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-teal-400 group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                                </div>
                            </button>
                        );
                    })
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No quizzes match your search</p>
                    </div>
                )}
            </div>

            {/* Show More/Less Button */}
            {hasMoreThanThree && (
                <button
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        setSearchTerm("");
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show All {quizzes.length} Quizzes
                        </>
                    )}
                </button>
            )}

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default QuizzesList;