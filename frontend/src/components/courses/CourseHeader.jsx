import { Calendar } from "lucide-react";

const CourseHeader = ({ course, difficultyColors, formatDate, getInitials }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="p-6 sm:p-8">
                {/* Category and difficulty badges */}
                <div className="flex flex-wrap items-start gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium text-teal-400 bg-teal-500/15">
                        {course?.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[course?.difficulty] || difficultyColors?.BEGINNER}`}>
                        {course?.difficulty}
                    </span>
                </div>

                {/* Course title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {course?.title}
                </h1>

                {/* Course description */}
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {course?.description}
                </p>

                {/* Creator Info */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                            }}
                        >
                            {getInitials(course?.creatorFirstName, course?.creatorLastName)}
                        </div>
                        <div>
                            <p className="text-white font-medium">
                                {course?.creatorFirstName} {course?.creatorLastName}
                            </p>
                            <p className="text-white/50 text-sm">{course?.creatorEmail}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {formatDate(course?.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>Updated: {formatDate(course?.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseHeader;