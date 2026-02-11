import { useState } from "react";
import {
    BookOpen,
    Tag,
    Calendar,
    Clock,
    ChevronDown,
    Check,
    Loader2
} from "lucide-react";

const CourseCatalogCard = ({
    course,
    onEnroll,
    isExpanded,
    onMouseEnter,
    onMouseLeave,
    isEnrolling = false,
    enrollSuccess = false,
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

    const categoryIcons = {
        MATH: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
        CHEMISTRY: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
        PHYSICS: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.59 13.41l-7.17 7.17a4 4 0 01-5.66 0L2 13.59 8.41 7l7.17 7.17a4 4 0 010 5.66L20.59 13.41z" /></svg>,
        HISTORY: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        LANGUAGE: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
        LITERATURE: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
        IT: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        BUSINESS: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        MUSIC: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>,
    };

    const categoryColors = {
        MATH: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
        CHEMISTRY: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
        PHYSICS: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
        HISTORY: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
        LANGUAGE: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
        LITERATURE: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
        IT: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
        BUSINESS: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
        MUSIC: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30" },
    };

    const difficultyColors = {
        BEGINNER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
        EASY: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
        INTERMEDIATE: "bg-amber-500/20 text-amber-400 border-amber-500/20",
        ADVANCED: "bg-rose-500/20 text-rose-400 border-rose-500/20",
        EXPERT: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        } catch (error) {
            return "";
        }
    };

    const catColor = categoryColors[course.category] || {
        bg: "bg-white/10",
        text: "text-white/60",
        border: "border-white/20"
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
                            {categoryIcons[course.category] || <BookOpen className="w-5 h-5" />}
                        </div>
                    </div>

                    {/* Difficulty badge */}
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${difficultyColors[course.difficulty] || 'bg-white/10 text-white/60 border-white/10'}`}>
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

                    {/* Expandable content */}
                    <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <p className="text-white/60 text-sm mb-4 leading-relaxed">
                            {course.description}
                        </p>

                        {/* Created date */}
                        <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                            <Clock className="w-3 h-3" />
                            <span>Created {formatDate(course.createdAt)}</span>
                        </div>

                        {course.isEnrolled ? (
                            <div className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                                enrollSuccess
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-white/60 border border-white/10'
                            }`}>
                                <Check className="w-4 h-4" />
                                <span>{enrollSuccess ? 'Enrolled Successfully!' : 'Already Enrolled'}</span>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEnroll(course.id, course.title);
                                }}
                                disabled={isEnrolling}
                                className="w-full py-3 px-6 rounded-xl font-semibold text-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                style={{
                                    background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                    boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)"
                                }}
                            >
                                {isEnrolling ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Enrolling...
                                    </>
                                ) : (
                                    "Enroll Now"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCatalogCard;