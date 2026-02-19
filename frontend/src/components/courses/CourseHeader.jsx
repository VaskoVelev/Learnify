import { Calendar, Edit2, Trash2, LogOut } from "lucide-react";
import { formatDate, getInitials } from "../../utils";
import { DIFFICULTY_COLORS } from "../../constants";

const CourseHeader = ({ course, showCreator = true, onEdit, onDelete, onLeave }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="p-6 sm:p-8">
                {/* Top row with badges and buttons */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Category and difficulty badges */}
                    <div className="flex flex-wrap items-start gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium text-teal-400 bg-teal-500/15 whitespace-nowrap">
                            {course?.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${DIFFICULTY_COLORS[course?.difficulty] || DIFFICULTY_COLORS?.BEGINNER}`}>
                            {course?.difficulty}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        {/* Leave Course button - for students */}
                        {onLeave && (
                            <button
                                onClick={onLeave}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all text-sm font-medium border border-amber-500/30 shrink-0"
                            >
                                <LogOut className="w-4 h-4" />
                                Leave Course
                            </button>
                        )}

                        {/* Teacher buttons */}
                        {onEdit && (
                            <button
                                onClick={onEdit}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all text-sm font-medium border border-amber-500/30 shrink-0"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Course
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={onDelete}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all text-sm font-medium border border-rose-500/30 shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Course
                            </button>
                        )}
                    </div>
                </div>

                {/* Course title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 break-words hyphens-auto">
                    {course?.title}
                </h1>

                {/* Course description */}
                <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-3xl break-words">
                    {course?.description}
                </p>

                {/* Creator Info - Conditional */}
                {showCreator ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                }}
                            >
                                {getInitials(course?.creatorFirstName, course?.creatorLastName)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white font-medium truncate">
                                    {course?.creatorFirstName} {course?.creatorLastName}
                                </p>
                                <p className="text-white/50 text-sm truncate">{course?.creatorEmail}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 shrink-0">
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span>Created: {formatDate(course?.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span>Updated: {formatDate(course?.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Just dates without creator info */
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Created: {formatDate(course?.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Updated: {formatDate(course?.updatedAt)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseHeader;