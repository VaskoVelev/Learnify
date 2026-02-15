import { Award, Calendar, CheckCircle } from "lucide-react";
import { formatDateTime } from "../../utils";

const QuizResultCard = ({ submission, onCheckAnswers }) => {
    if (!submission) return null;

    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                        <Award className="w-3.5 h-3.5 text-teal-400" />
                        <span className="text-xs font-medium text-teal-400">Quiz Results</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Score Circle - Using the same design as AverageScoreCard */}
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-white/10"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="url(#scoreGradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${(submission.score || 0) * 3.52} 352`}
                            />
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="hsl(174, 72%, 46%)" />
                                    <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{submission.score || 0}%</span>
                        </div>
                    </div>

                    {/* Submission Details */}
                    <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                <Calendar className="w-5 h-5 text-teal-400" />
                                <div>
                                    <p className="text-white/40 text-xs">Submitted</p>
                                    <p className="text-white text-sm">{formatDateTime(submission.submittedAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                <CheckCircle className="w-5 h-5 text-teal-400" />
                                <div>
                                    <p className="text-white/40 text-xs">Status</p>
                                    <p className="text-white text-sm">Completed</p>
                                </div>
                            </div>
                        </div>

                        {/* Score message */}
                        <p className="text-white/60 text-sm">
                            {submission.score >= 80
                                ? "Excellent work! You've mastered this quiz."
                                : submission.score >= 60
                                    ? "Good job! Keep practicing to improve."
                                    : "Keep studying and try again to improve your score."}
                        </p>

                        {/* Check Answers Button */}
                        <button
                            onClick={onCheckAnswers}
                            className="mt-2 px-6 py-2.5 rounded-xl font-semibold text-white transition-all inline-flex items-center gap-2"
                            style={{
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.3)"
                            }}
                        >
                            <CheckCircle className="w-4 h-4" />
                            Check Answers
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResultCard;