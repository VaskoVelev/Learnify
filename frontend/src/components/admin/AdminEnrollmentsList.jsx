import { useState, useMemo } from "react";
import { Users, Calendar, ChevronDown, ChevronUp, Search, BookOpen, User, Trash2 } from "lucide-react";
import { formatDateTime } from "../../utils";

const AdminEnrollmentsList = ({ enrollments = [], onDeleteEnrollment, className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const sortedEnrollments = useMemo(() => {
        return [...enrollments].sort((a, b) =>
            new Date(b.enrolledAt) - new Date(a.enrolledAt)
        );
    }, [enrollments]);

    if (!enrollments || enrollments.length === 0) {
        return (
            <div
                className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                style={{
                    background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                        <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">All Enrollments</h3>
                </div>
                <div className="text-center py-8">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No enrollments found</p>
                </div>
            </div>
        );
    }

    const displayedEnrollments = isExpanded ? sortedEnrollments : sortedEnrollments.slice(0, 5);

    const filteredEnrollments = searchTerm && isExpanded
        ? displayedEnrollments.filter(e =>
            `${e.studentFirstName} ${e.studentLastName} ${e.title} ${e.teacherFirstName} ${e.teacherLastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        : displayedEnrollments;

    const hasMoreThanFive = sortedEnrollments.length > 5;

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
                    <div className="p-2 rounded-lg bg-purple-500/20">
                        <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">All Enrollments</h3>
                        <p className="text-xs text-white/40">{sortedEnrollments.length} total</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {isExpanded && hasMoreThanFive && (
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by student, course, or teacher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/30 text-sm"
                    />
                </div>
            )}

            {/* Enrollments List */}
            <div className={`space-y-4 ${isExpanded ? 'max-h-[500px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map((enrollment) => (
                        <div
                            key={`${enrollment.studentId}-${enrollment.courseId}`}
                            className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            {/* Header with student and course info */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-purple-500/20">
                                            <User className="w-3.5 h-3.5 text-purple-400" />
                                        </div>
                                        <span className="text-white font-medium">
                                            {enrollment.studentFirstName} {enrollment.studentLastName}
                                        </span>
                                        <span className="text-white/30 text-sm">(Student)</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-1.5 rounded-lg bg-teal-500/20">
                                            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                                        </div>
                                        <span className="text-white/90">
                                            {enrollment.title}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-amber-500/20">
                                            <User className="w-3.5 h-3.5 text-amber-400" />
                                        </div>
                                        <span className="text-white/70 text-sm">
                                            {enrollment.teacherFirstName} {enrollment.teacherLastName}
                                        </span>
                                        <span className="text-white/30 text-sm">(Teacher)</span>
                                    </div>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteEnrollment(enrollment.studentId, enrollment.courseId,
                                            `${enrollment.studentFirstName} ${enrollment.studentLastName}`,
                                            enrollment.title);
                                    }}
                                    className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all border border-rose-500/30 shrink-0"
                                    title="Delete enrollment"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Enrollment date */}
                            <div className="flex items-center gap-1.5 text-xs text-white/30 mt-2 pt-2 border-t border-white/5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Enrolled {formatDateTime(enrollment.enrolledAt)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No enrollments match your search</p>
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
                            Show All {sortedEnrollments.length} Enrollments
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

export default AdminEnrollmentsList;