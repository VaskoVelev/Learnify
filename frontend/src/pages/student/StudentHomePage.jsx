import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"
import { getMyEnrollments } from "../../api/enrollment.api.js";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs
} from "../../components/layout";
import {
    GlobalError,
    LoadingState,
    EmptyState,
    WelcomeBadge,
    WelcomeSection,
    StatsCard,
    SectionHeader
} from "../../components/ui";
import { BookOpen, Clock, ChevronRight, TrendingUp, Award, Calendar, Sparkles } from "lucide-react";

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
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={false}
                showCourses={true}
                showProfile={true}
            />

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                {/* Welcome Section */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <WelcomeBadge text="Welcome back" icon={Sparkles} className="mb-3" />
                            <WelcomeSection
                                user={user}
                                title="Hello"
                                subtitle="Continue your learning journey. You're making great progress!"
                            />
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="flex gap-3 sm:gap-4">
                            <StatsCard
                                icon={BookOpen}
                                label="Courses"
                                value={totalCourses}
                                color="teal"
                                gradient="linear-gradient(145deg, hsla(174, 70%, 40%, 0.15) 0%, hsla(174, 70%, 40%, 0.05) 100%)"
                            />

                            <StatsCard
                                icon={TrendingUp}
                                label="Progress"
                                value={`${averageProgress}%`}
                                color="cyan"
                                gradient="linear-gradient(145deg, hsla(199, 85%, 45%, 0.15) 0%, hsla(199, 85%, 45%, 0.05) 100%)"
                            />

                            <StatsCard
                                icon={Award}
                                label="Completed"
                                value={completedCourses}
                                color="amber"
                                gradient="linear-gradient(145deg, hsla(45, 85%, 50%, 0.15) 0%, hsla(45, 85%, 50%, 0.05) 100%)"
                                hiddenOnMobile={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {/* Enrolled Courses Section */}
                <section>
                    <SectionHeader
                        icon={BookOpen}
                        title="My Courses"
                    />

                    {isLoading ? (
                        <LoadingState message="Loading your courses..." />
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
                        <EmptyState
                            icon={BookOpen}
                            title="No courses yet"
                            description="Start your learning journey by exploring our catalog and enrolling in a course"
                            actionText="Browse Courses"
                            actionLink="/courses"
                        />
                    )}
                </section>

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default StudentHomePage;