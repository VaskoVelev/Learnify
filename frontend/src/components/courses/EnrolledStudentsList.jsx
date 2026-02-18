import { useState } from "react";
import { Users, Calendar, ChevronDown, ChevronUp, Search, TrendingUp, Award } from "lucide-react";
import { formatDate } from "../../utils";

const EnrolledStudentsList = ({ students = [], className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    if (!students || students.length === 0) {
        return (
            <div
                className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{
                    background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                        <Users className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Enrolled Students</h3>
                </div>
                <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No students enrolled yet</p>
                </div>
            </div>
        );
    }

    // Get the students to display based on expanded state
    const displayedStudents = isExpanded ? students : students.slice(0, 3);

    // Filter based on search term (only applied when expanded)
    const filteredStudents = searchTerm && isExpanded
        ? displayedStudents.filter(s =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : displayedStudents;

    const hasMoreThanFive = students.length > 5;

    // Get badge color based on progress
    const getProgressColor = (progress) => {
        if (progress >= 80) return "bg-emerald-500";
        if (progress >= 50) return "bg-amber-500";
        return "bg-rose-500";
    };

    // Get score color based on value
    const getScoreColor = (score) => {
        if (score >= 80) return "text-emerald-400";
        if (score >= 50) return "text-amber-400";
        return "text-rose-400";
    };

    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                        <Users className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Enrolled Students</h3>
                        <p className="text-xs text-white/40">{students.length} total</p>
                    </div>
                </div>
            </div>

            {/* Search Bar - only show when expanded */}
            {isExpanded && hasMoreThanFive && (
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/30 text-sm"
                    />
                </div>
            )}

            {/* Students List */}
            <div className={`space-y-4 ${isExpanded ? 'max-h-[400px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            {/* Student header with name and avatar */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-gray-900 shrink-0">
                                        {`${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">
                                            {student.firstName} {student.lastName}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-white/30">
                                            <Calendar className="w-3 h-3" />
                                            <span>Enrolled {formatDate(student.enrolledAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress and Score stats */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {/* Progress */}
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-teal-400/70" />
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-0.5">
                                            <span className="text-white/40">Progress</span>
                                            <span className={`text-xs font-medium ${getScoreColor(student.progressionPercent || 0)}`}>
                                                {student.progressionPercent || 0}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${getProgressColor(student.progressionPercent || 0)}`}
                                                style={{ width: `${student.progressionPercent || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Average Score */}
                                <div className="flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-amber-400/70" />
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-0.5">
                                            <span className="text-white/40">Avg Score</span>
                                            <span className={`text-xs font-medium ${getScoreColor(student.averageScore || 0)}`}>
                                                {student.averageScore || 0}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${getProgressColor(student.averageScore || 0)}`}
                                                style={{ width: `${student.averageScore || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No students match your search</p>
                    </div>
                )}
            </div>

            {/* Show More/Less Button */}
            {hasMoreThanFive && (
                <button
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        setSearchTerm("");
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show All {students.length} Students
                        </>
                    )}
                </button>
            )}

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default EnrolledStudentsList;