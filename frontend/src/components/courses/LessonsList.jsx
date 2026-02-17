import { BookOpen, ChevronRight, Search, PlusCircle } from "lucide-react";

const LessonsList = ({ lessons, onLessonClick, showCreateButton = false, onCreateClick }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                    Course Lessons
                </h3>
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

            {lessons.length > 0 ? (
                <div className="space-y-2">
                    {lessons.map((lesson, index) => (
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
                    ))}
                </div>
            ) : (
                <div
                    className="p-12 sm:p-16 rounded-2xl border border-white/10 text-center backdrop-blur-xl relative overflow-hidden"
                    style={{
                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                    }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-500/10 blur-3xl rounded-full" />
                    <div className="relative">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Search className="w-10 h-10 text-white/30" />
                        </div>
                        <h3 className="text-2xl font-semibold text-white mb-3">No lessons available</h3>
                        <p className="text-white/60 max-w-sm mx-auto mb-6">
                            There are no lessons available for this course yet.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonsList;