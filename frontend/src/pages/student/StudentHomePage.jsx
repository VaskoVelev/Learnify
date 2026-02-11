import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"
import { getMyEnrollments } from "../../api/enrollment.api.js";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    EmptyState,
    WelcomeBadge,
    WelcomeSection,
    StatsCard,
    SectionHeader,
    CourseCard
} from "../../components";
import { BookOpen, TrendingUp, Award, Sparkles } from "lucide-react";

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
                            <WelcomeBadge
                                text="Welcome back"
                                icon={Sparkles}
                                className="mb-3"
                            />

                            <WelcomeSection
                                coloredText={user?.firstName}
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
                                <CourseCard
                                    key={course.id}
                                    course={course}
                                    onClick={handleCourseClick}
                                    index={index}
                                />
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