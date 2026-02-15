import { Award, Calendar } from "lucide-react";
import { formatDateTime } from "../../utils";

const ReviewResultCard = ({ submission }) => {
    if (!submission) return null;

    const answers = submission?.answers || [];
    const totalQuestions = answers.length;
    const correctCount = answers.filter(a => a.correct).length;

    return (
        <div
            className="rounded-2xl backdrop-blur-xl border border-teal-500/30 p-6 mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(174, 72%, 46%, 0.15) 0%, hsla(199, 89%, 48%, 0.05) 100%)",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Award className="w-8 h-8 text-teal-400" />
                    <div>
                        <h3 className="text-white font-semibold text-lg">Quiz Results</h3>
                        <p className="text-white/60 text-sm">
                            You scored {submission.score}% ({correctCount}/{totalQuestions} correct)
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDateTime(submission.submittedAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default ReviewResultCard;