import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourse } from "../../api/course.api";
import { getUser } from "../../api/user.api";
import { getMyProgression } from "../../api/course.api";
import { getCourseLessons } from "../../api/lesson.api";
import {
    GraduationCap,
    Home,
    User,
    LogOut,
    BookOpen,
    Calendar,
    BarChart3,
    Trophy,
    ChevronRight,
    ArrowLeft,
    AlertCircle,
    Sparkles,
    Search,
    Tag,
    Clock
} from "lucide-react";

const CoursePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [courseCreator, setCourseCreator] = useState(null);
    const [progress, setProgress] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const difficultyColors = {
        BEGINNER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
        EASY: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
        INTERMEDIATE: "bg-amber-500/20 text-amber-400 border-amber-500/20",
        ADVANCED: "bg-rose-500/20 text-rose-400 border-rose-500/20",
        EXPERT: "bg-purple-500/20 text-purple-400 border-purple-500/20",
    };

    const categoryColors = {
        MATH: "bg-blue-500/20 text-blue-400 border-blue-500/20",
        CHEMISTRY: "bg-green-500/20 text-green-400 border-green-500/20",
        PHYSICS: "bg-orange-500/20 text-orange-400 border-orange-500/20",
        HISTORY: "bg-amber-500/20 text-amber-400 border-amber-500/20",
        LANGUAGE: "bg-pink-500/20 text-pink-400 border-pink-500/20",
        LITERATURE: "bg-violet-500/20 text-violet-400 border-violet-500/20",
        IT: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
        BUSINESS: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
        MUSIC: "bg-rose-500/20 text-rose-400 border-rose-500/20",
    };

    const fetchCourseData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const courseData = await getCourse(courseId);
            setCourse(courseData);

            try {
                const progressionData = await getMyProgression(courseId);
                setProgress(progressionData);
            } catch (progressionError) {
                setProgress({
                    progressPercent: 0,
                    averageScore: 0
                });
            }

            const lessonsData = await getCourseLessons(courseId);
            setLessons(lessonsData);

            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setLessons([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourseData();
    }, [courseId]);

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

    const handleLessonClick = (lessonId) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getInitials = (firstName, lastName) => {
        return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
    };

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
                    <Link to="/home" className="flex items-center gap-3 group">
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
                            to="/home"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
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
                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Loading State */}
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
                ) : (
                    <>
                        {/* Course Header Card - Like first example page */}
                        <div
                            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
                            style={{
                                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                            }}
                        >
                            <div className="p-6 sm:p-8">
                                {/* Category and difficulty badges - Top row like first example */}
                                <div className="flex flex-wrap items-start gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium text-teal-400 bg-teal-500/15">
                                    {course.category}
                                </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${difficultyColors[course.difficulty] || difficultyColors.BEGINNER}`}>
                                    {course.difficulty}
                                </span>
                                </div>

                                {/* Course title - Moved inside the box */}
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                    {course.title}
                                </h1>

                                {/* Course description */}
                                <p className="text-white/70 text-lg leading-relaxed mb-8">
                                    {course.description}
                                </p>

                                {/* Creator Info - Like first example page */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                                            style={{
                                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                            }}
                                        >
                                            {getInitials(course.creatorFirstName, course.creatorLastName)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {course.creatorFirstName} {course.creatorLastName}
                                            </p>
                                            <p className="text-white/50 text-sm">{course.creatorEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>Created: {formatDate(course.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>Updated: {formatDate(course.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Column - Progress Stats */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Progress Card - Removed "Lessons Completed" */}
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-teal-400" />
                                        Your Progress
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-white/60">Completion</span>
                                                <span className="text-white font-medium">{progress?.progressPercent || 0}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${progress?.progressPercent || 0}%`,
                                                        background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Average Score Card */}
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-amber-400" />
                                        Average Score
                                    </h3>
                                    <div className="flex items-center justify-center">
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
                                                    strokeDasharray={`${(progress?.averageScore || 0) * 3.52} 352`}
                                                />
                                                <defs>
                                                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="hsl(174, 72%, 46%)" />
                                                        <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-3xl font-bold text-white">{progress?.averageScore || 0}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Lessons */}
                            <div className="lg:col-span-2">
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-teal-400" />
                                        Course Lessons
                                    </h3>

                                    {lessons.length > 0 ? (
                                        <div className="space-y-2">
                                            {lessons.map((lesson, index) => (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => handleLessonClick(lesson.id)}
                                                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all duration-200 group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                    <span
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium text-teal-400"
                                                        style={{
                                                            background: "linear-gradient(145deg, hsla(174, 72%, 46%, 0.15) 0%, hsla(174, 72%, 46%, 0.05) 100%)",
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </span>
                                                        <span className="text-white/80 group-hover:text-white transition-colors text-left">
                                                        {lesson.title}
                                                    </span>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div
                                            className="p-12 sm:p-16 rounded-2xl border border-white/10 text-center backdrop-blur-xl relative overflow-hidden"
                                            style={{
                                                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                            }}
                                        >
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-500/10 blur-3xl rounded-full" />

                                            <div className="relative">
                                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                    <Search className="w-10 h-10 text-white/30" />
                                                </div>
                                                <h3 className="text-2xl font-semibold text-white mb-3">No lessons available</h3>
                                                <p className="text-white/60 max-w-sm mx-auto">
                                                    There are no lessons available for this course yet.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Footer section */}
                <footer className="relative z-10 border-t border-white/10 mt-12 pt-8">
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
                </footer>
            </main>
        </div>
    );
};

export default CoursePage;
