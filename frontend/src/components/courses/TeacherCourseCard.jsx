import { BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import { formatDate } from "../../utils";

const TeacherCourseCard = ({ course, onClick, index = 0 }) => {
    const {
        id,
        title,
        createdAt,
        updatedAt
    } = course;

    return (
        <div
            onClick={() => onClick(id)}
            className="group relative p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xl hover:border-teal-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                animationDelay: `${index * 100}ms`
            }}
        >
            {/* Card glow effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, hsla(174, 72%, 46%, 0.1) 0%, transparent 70%)" }}
            />

            {/* Course icon with animated background */}
            <div className="relative flex items-start justify-between mb-5">
                <div className="relative">
                    <div className="absolute inset-0 bg-teal-500/30 blur-xl rounded-full group-hover:bg-teal-500/40 transition-colors" />
                    <div className="relative p-3.5 rounded-xl bg-teal-500/20 text-teal-400 group-hover:bg-teal-500/30 transition-colors border border-teal-500/20">
                        <BookOpen className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Course title */}
            <h3 className="text-lg font-semibold text-white mb-4 group-hover:text-teal-400 transition-colors line-clamp-2">
                {title}
            </h3>

            {/* Dates */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDate(createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40">
                    <Clock className="w-3 h-3" />
                    <span>Updated {formatDate(updatedAt)}</span>
                </div>
            </div>

            {/* Manage button */}
            <div className="mt-5 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Manage course</span>
                    <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default TeacherCourseCard;