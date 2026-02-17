import { FileText } from "lucide-react";

const LessonContent = ({ content }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-400" />
                Lesson Content
            </h3>

            {content ? (
                <div className="prose prose-invert max-w-none">
                    {content.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="text-white/70 leading-relaxed mb-4 whitespace-pre-line">
                            {paragraph}
                        </p>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No content available for this lesson</p>
                </div>
            )}
        </div>
    );
};

export default LessonContent;