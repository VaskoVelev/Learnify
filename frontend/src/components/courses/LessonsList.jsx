import { useState } from "react";
import { BookOpen, ChevronRight, Search, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";

const LessonsList = ({ lessons, onLessonClick, showCreateButton = false, onCreateClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    if (!lessons || lessons.length === 0) {
        return (
            <div
                className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{
                    background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-500/20">
                            <BookOpen className="w-5 h-5 text-teal-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Course Lessons</h3>
                    </div>
                    {showCreateButton && (
                        <button
                            onClick={onCreateClick}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Lesson
                        </button>
                    )}
                </div>

                {/* Empty state message */}
                <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No lessons available</p>
                </div>
            </div>
        );
    }

    const hasMoreThanThree = lessons.length > 3;

    const displayedLessons = isExpanded ? lessons : lessons.slice(0, 3);

    const filteredLessons = searchTerm && isExpanded
        ? displayedLessons.filter(lesson =>
            lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : displayedLessons;

    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                        <BookOpen className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Course Lessons</h3>
                </div>
                {showCreateButton && (
                    <button
                        onClick={onCreateClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Lesson
                    </button>
                )}
            </div>

            {/* Search Bar */}
            {isExpanded && hasMoreThanThree && (
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search lessons..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/30 text-sm"
                    />
                </div>
            )}

            {/* Lessons List */}
            <div className={`space-y-2 ${isExpanded ? 'max-h-[300px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredLessons.length > 0 ? (
                    filteredLessons.map((lesson, index) => (
                        <button
                            key={lesson.id}
                            onClick={() => onLessonClick(lesson.id)}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all duration-200 group"
                        >
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                <span
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-teal-400 shrink-0"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(174, 72%, 46%, 0.15) 0%, hsla(174, 72%, 46%, 0.05) 100%)",
                                    }}
                                >
                                    {index + 1}
                                </span>
                                <span className="text-white/80 group-hover:text-white transition-colors text-left break-words">
                                    {lesson.title}
                                </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                        </button>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No lessons match your search</p>
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
                            Show All {lessons.length} Lessons
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

export default LessonsList;