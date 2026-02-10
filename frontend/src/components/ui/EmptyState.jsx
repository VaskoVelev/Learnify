import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";

const EmptyState = ({
    icon: Icon = BookOpen,
    title = "No courses yet",
    description = "Start your learning journey by exploring our catalog and enrolling in a course",
    actionText = "Browse Courses",
    actionLink = "/courses",
    onActionClick,
    className = ""
}) => {
    return (
        <div
            className={`p-12 sm:p-16 rounded-2xl border border-white/10 text-center backdrop-blur-xl relative overflow-hidden ${className}`}
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-500/10 blur-3xl rounded-full" />
            <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-white/30" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-white/60 mb-8 max-w-sm mx-auto">{description}</p>
                {actionLink ? (
                    <Link
                        to={actionLink}
                        className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl font-semibold text-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                            boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)"
                        }}
                    >
                        {actionText}
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                ) : (
                    <button
                        onClick={onActionClick}
                        className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl font-semibold text-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                            background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                            boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)"
                        }}
                    >
                        {actionText}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmptyState;