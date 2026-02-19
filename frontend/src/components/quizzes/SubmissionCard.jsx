import { History, Calendar, ChevronRight, User } from "lucide-react";
import { formatDateTime, getScoreColor, getScoreBgColor } from "../../utils";

const SubmissionCard = ({ submission, onClick, showStudentName = false }) => {
    // Construct full name if first and last name are available
    const studentName = submission.studentFirstName && submission.studentLastName
        ? `${submission.studentFirstName} ${submission.studentLastName}`
        : null;

    return (
        <button
            onClick={onClick}
            className="w-full text-left p-6 rounded-2xl border border-white/10 backdrop-blur-xl hover:border-teal-500/40 transition-all group"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                        <History className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            {showStudentName && studentName && (
                                <span className="text-white text-sm font-medium flex items-center gap-1 mr-2 bg-white/5 px-2 py-0.5 rounded-lg">
                                    <User className="w-3.5 h-3.5 text-white/40" />
                                    {studentName}
                                </span>
                            )}
                            <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getScoreBgColor(submission.score)} ${getScoreColor(submission.score)}`}>
                                Score: {submission.score}%
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/40">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDateTime(submission.submittedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
            </div>
        </button>
    );
};

export default SubmissionCard;