import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"
import { getMyEnrollments } from "../../api/enrollment.api.js";
import { getMyProgression } from "../../api/course.api.js";
import { GraduationCap, BookOpen, User, LogOut, Clock, ChevronRight, TrendingUp, Award, Calendar, Sparkles } from "lucide-react";

const StudentHomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const enrollments = await getMyEnrollments();

                const transformedCourses = enrollments.map(enrollment => ({
                    id: enrollment.id,
                    title: enrollment.title,
                    teacherFirstName: enrollment.firstName,
                    teacherLastName: enrollment.lastName,
                    teacherId: enrollment.teacherId,
                    enrolledAt: enrollment.enrolledAt,
                    progress: enrollment.progressionPercent,
                }));

                setEnrolledCourses(transformedCourses);
            } catch (err) {
                setError(err.message);
                setEnrolledCourses([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await logout();
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCourseClick = (courseId) => {
        navigate(`/courses/${courseId}`);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const totalCourses = enrolledCourses.length;
    const averageProgress = totalCourses > 0
        ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / totalCourses)
        : 0;
    const completedCourses = enrolledCourses.filter(c => c.progress >= 100).length;

    return (
        <div
            className="min-h-screen"
            style={{ background: "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)" }}
        >
            {/* Floating orbs */}
            <div className="fixed w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-15 -top-32 -left-32 pointer-events-none" />
            <div className="fixed w-80 h-80 bg-cyan-500 rounded-full blur-[100px] opacity-15 bottom-20 right-10 pointer-events-none" />
            <div className="fixed w-64 h-64 bg-teal-400 rounded-full blur-[80px] opacity-10 top-1/2 left-1/3 pointer-events-none" />
            <div className="fixed w-48 h-48 bg-blue-500 rounded-full blur-[60px] opacity-10 top-1/4 right-1/4 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 group-hover:bg-white/15 group-hover:border-teal-500/30 transition-all duration-300">
                            <GraduationCap className="w-6 h-6 text-teal-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Learn<span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)" }}
                        >ify</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link
                            to="/courses"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">Courses</span>
                        </Link>
                        <Link
                            to="/profile"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                {/* Welcome Section */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                                    <span className="text-xs font-medium text-teal-400">Welcome back</span>
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                                Hello, <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 56%) 0%, hsl(199, 89%, 58%) 100%)" }}
                            >{user?.firstName}</span>!
                            </h1>
                            <p className="text-white/60 text-base sm:text-lg max-w-xl">
                                Continue your learning journey. You're making great progress!
                            </p>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="flex gap-3 sm:gap-4">
                            <div
                                className="flex-1 sm:flex-none sm:w-36 p-4 rounded-2xl border border-white/10 backdrop-blur-xl"
                                style={{ background: "linear-gradient(145deg, hsla(174, 70%, 40%, 0.15) 0%, hsla(174, 70%, 40%, 0.05) 100%)" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="w-4 h-4 text-teal-400" />
                                    <span className="text-xs text-white/50 uppercase tracking-wide">Courses</span>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{totalCourses}</p>
                            </div>
                            <div
                                className="flex-1 sm:flex-none sm:w-36 p-4 rounded-2xl border border-white/10 backdrop-blur-xl"
                                style={{ background: "linear-gradient(145deg, hsla(199, 85%, 45%, 0.15) 0%, hsla(199, 85%, 45%, 0.05) 100%)" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                                    <span className="text-xs text-white/50 uppercase tracking-wide">Progress</span>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{averageProgress}%</p>
                            </div>
                            <div
                                className="hidden sm:block flex-none w-36 p-4 rounded-2xl border border-white/10 backdrop-blur-xl"
                                style={{ background: "linear-gradient(145deg, hsla(45, 85%, 50%, 0.15) 0%, hsla(45, 85%, 50%, 0.05) 100%)" }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs text-white/50 uppercase tracking-wide">Completed</span>
                                </div>
                                <p className="text-2xl sm:text-3xl font-bold text-white">{completedCourses}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}

                {/* Enrolled Courses Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <BookOpen className="w-5 h-5 text-teal-400" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-white">My Courses</h2>
                        </div>
                    </div>

                    {isLoading ? (
                        <div
                            className="p-12 rounded-2xl border border-white/10 text-center backdrop-blur-xl"
                            style={{
                                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                            }}
                        >
                            <div className="flex justify-center">
                                <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-white/60 mt-4">Loading, wait a sec...</p>
                        </div>
                    ) : enrolledCourses.length > 0 ? (
                        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {enrolledCourses.map((course, index) => (
                                <div
                                    key={course.id}
                                    onClick={() => handleCourseClick(course.id)}
                                    className="group relative p-5 sm:p-6 rounded-2xl border border-white/10 backdrop-blur-xl hover:border-teal-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                        animationDelay: `${index * 100}ms`
                                    }}
                                >
                                    {/* Card glow effect on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                         style={{ background: "radial-gradient(circle at 50% 0%, hsla(174, 72%, 46%, 0.1) 0%, transparent 70%)" }}
                                    />

                                    {/* Course icon with animated background */}
                                    <div className="relative flex items-start justify-between mb-5">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-teal-500/30 blur-xl rounded-full group-hover:bg-teal-500/40 transition-colors" />
                                            <div className="relative p-3.5 rounded-xl bg-teal-500/20 text-teal-400 group-hover:bg-teal-500/30 transition-colors border border-teal-500/20">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                        </div>

                                        {/* Progress badge */}
                                        <div className="flex flex-col items-end gap-1.5">
                                            <div className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                                                course.progress >= 80
                                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                                    : course.progress >= 40
                                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                                        : 'bg-white/10 text-white/60 border border-white/10'
                                            }`}>
                                                <Clock className="w-3 h-3" />
                                                {course.progress}%
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course title */}
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>

                                    {/* Teacher info */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-gray-900">
                                            {`${course.teacherFirstName[0]}${course.teacherLastName[0]}`}
                                        </div>
                                        <p className="text-white/60 text-sm">
                                            {course.teacherFirstName} {course.teacherLastName}
                                        </p>
                                    </div>

                                    {/* Enrolled date */}
                                    <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                                        <Calendar className="w-3 h-3" />
                                        <span>Enrolled {formatDate(course.enrolledAt)}</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-white/40">Progress</span>
                                            <span className="text-white/60 font-medium">
                                                {course.progress}% complete
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                                                style={{
                                                    width: `${course.progress}%`,
                                                    background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                                                }}
                                            >
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Continue button */}
                                    <div className="mt-5 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-white/50">Continue learning</span>
                                            <ChevronRight className="w-4 h-4 text-teal-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="p-12 sm:p-16 rounded-2xl border border-white/10 text-center backdrop-blur-xl relative overflow-hidden"
                            style={{
                                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                            }}
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-500/10 blur-3xl rounded-full" />

                            <div className="relative">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <BookOpen className="w-10 h-10 text-white/30" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">No courses yet</h3>
                                <p className="text-white/60 mb-8 max-w-sm mx-auto">
                                    Start your learning journey by exploring our catalog and enrolling in a course
                                </p>
                                <Link
                                    to="/courses"
                                    className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl font-semibold text-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                    style={{
                                        background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                        boxShadow: "0 0 40px hsla(174, 72%, 46%, 0.3)"
                                    }}
                                >
                                    Browse Courses
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer section */}
                <footer className="relative z-10 border-t border-white/10 mt-12">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-teal-400" />
                                <span className="text-white/60 text-sm">
                                © 2026 Learnify. Keep learning, keep growing.
                            </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                    Help Center
                                </a>
                                <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                    Terms
                                </a>
                                <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                    Privacy
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default StudentHomePage;
