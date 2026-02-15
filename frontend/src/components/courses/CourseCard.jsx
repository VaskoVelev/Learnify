import { BookOpen, Clock, Calendar, ChevronRight } from "lucide-react";
import { formatDate, getInitials, getProgressBadgeColor } from "../../utils";

const CourseCard = ({ course, onClick, className = "", index = 0 }) => {
    const {
        id,
        title,
        teacherFirstName,
        teacherLastName,
        enrolledAt,
        progress
    } = course;

    return (
        <div
            key={id}
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

                {/* Progress badge */}
                <div className="flex flex-col items-end gap-1.5">
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${getProgressBadgeColor(progress)}`}>
                        <Clock className="w-3 h-3" />
                        {progress}%
                    </div>
                </div>
            </div>

            {/* Course title */}
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                {title}
            </h3>

            {/* Teacher info */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-gray-900">
                    {getInitials(teacherFirstName, teacherLastName)}
                </div>
                <p className="text-white/60 text-sm">
                    {teacherFirstName} {teacherLastName}
                </p>
            </div>

            {/* Enrolled date */}
            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                <Calendar className="w-3 h-3" />
                <span>Enrolled {formatDate(enrolledAt)}</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs">
                    <span className="text-white/40">Progress</span>
                    <span className="text-white/60 font-medium">
                        {progress}% complete
                    </span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                        style={{
                            width: `${progress}%`,
                            background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                        }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                </div>
            </div>

            {/* Continue button */}
            <div className="mt-5 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Continue learning</span>
                    <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};

export default CourseCard;