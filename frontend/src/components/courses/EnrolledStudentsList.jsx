import { useState, useMemo } from "react";
import { Users, Calendar, ChevronDown, ChevronUp, Search } from "lucide-react";
import { formatDate } from "../../utils";

const EnrolledStudentsList = ({ students = [], className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const sortedStudents = useMemo(() => {
        return [...students].sort((a, b) => {
            const firstNameCompare = (a.firstName || "").localeCompare(b.firstName || "");
            if (firstNameCompare !== 0) return firstNameCompare;

            return (a.lastName || "").localeCompare(b.lastName || "");
        });
    }, [students]);

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

    const displayedStudents = isExpanded ? sortedStudents : sortedStudents.slice(0, 3);

    const filteredStudents = searchTerm && isExpanded
        ? displayedStudents.filter(s =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : displayedStudents;

    const hasMoreThanThree = sortedStudents.length > 3;

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
                        <p className="text-xs text-white/40">{sortedStudents.length} total</p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {isExpanded && hasMoreThanThree && (
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
            <div className={`space-y-3 ${isExpanded ? 'max-h-[300px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar with initials */}
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

                            {/* Student indicator dot */}
                            <div className="w-2 h-2 rounded-full bg-emerald-400/50 group-hover:bg-emerald-400 transition-colors" />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No students match your search</p>
                    </div>
                )}
            </div>

            {/* Show More/Less Button */}
            {hasMoreThanThree && (
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
                            Show All {sortedStudents.length} Students
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