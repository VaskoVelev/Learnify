import { Sparkles, Edit2 } from "lucide-react";

const LessonHeader = ({ title, onEdit }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                            <span className="text-xs font-medium text-teal-400">Lesson Details</span>
                        </div>
                    </div>
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all text-sm font-medium border border-amber-500/30"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Lesson
                        </button>
                    )}
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 break-words">
                    {title}
                </h1>
            </div>
        </div>
    );
};

export default LessonHeader;