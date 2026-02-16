import { useState } from "react";
import {
    BookOpen,
    Tag,
    Calendar,
    Clock,
    ChevronDown
} from "lucide-react";
import { formatDate } from "../../utils";
import { CATEGORY_COLORS, CATEGORY_ICONS, DIFFICULTY_COLORS as DIFFICULTY_CLASSES } from "../../constants";

const TeacherCourseCatalogCard = ({
    course,
    isExpanded,
    onMouseEnter,
    onMouseLeave,
    className = ""
}) => {
    const [isLocalExpanded, setIsLocalExpanded] = useState(false);

    const expanded = isExpanded !== undefined ? isExpanded : isLocalExpanded;
    const handleExpand = () => {
        if (onMouseEnter) {
            onMouseEnter();
        } else {
            setIsLocalExpanded(!isLocalExpanded);
        }
    };

    const catColor = CATEGORY_COLORS[course.category] || {
        bg: "bg-teal-500/20",
        text: "text-teal-400",
        border: "border-teal-500/20"
    };

    return (
        <div
            key={course.id}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="group relative rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-teal-500/40"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            {/* Card glow effect on hover */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle at 50% 0%, hsla(174, 72%, 46%, 0.1) 0%, transparent 70%)" }}
            />

            <div className="p-5 sm:p-6">
                {/* Course icon */}
                <div className="relative flex items-start justify-between mb-5">
                    <div className="relative">
                        <div className="absolute inset-0 bg-teal-500/30 blur-xl rounded-full group-hover:bg-teal-500/40 transition-colors" />
                        <div className={`relative p-3.5 rounded-xl ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
                            {CATEGORY_ICONS[course.category] || <BookOpen className="w-5 h-5" />}
                        </div>
                    </div>

                    {/* Difficulty badge */}
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${DIFFICULTY_CLASSES[course.difficulty] || 'bg-white/10 text-white/60 border-white/10'}`}>
                        {course.difficulty}
                    </div>
                </div>

                {/* Course title */}
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                    {course.title}
                </h3>

                {/* Category */}
                <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                    <Tag className="w-3 h-3" />
                    <span>{course.category}</span>
                </div>

                {/* Updated date */}
                <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Updated {formatDate(course.updatedAt)}</span>
                </div>

                {/* Learn More section */}
                <div className="pt-4 border-t border-white/5">
                    <div
                        onClick={handleExpand}
                        className="flex items-center justify-between text-sm cursor-pointer"
                    >
                        <span className="text-white/50">Learn more</span>
                        <ChevronDown className={`w-4 h-4 text-teal-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Expandable content - NO ENROLL BUTTON */}
                    <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <p className="text-white/60 text-sm mb-4 leading-relaxed">
                            {course.description}
                        </p>

                        {/* Created date */}
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <Clock className="w-3 h-3" />
                            <span>Created {formatDate(course.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherCourseCatalogCard;