import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"
import { getMyCoursesCreated } from "../../api/course.api.js";
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
    TeacherCourseCard
} from "../../components";
import { BookOpen, Sparkles, PlusCircle } from "lucide-react";

const TeacherHomePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [createdCourses, setCreatedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCreatedCourses = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const courses = await getMyCoursesCreated();
            setCreatedCourses(courses);
        } catch (err) {
            setError(err.message);
            setCreatedCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCreatedCourses();
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

    const handleCreateCourse = () => {
        navigate("/courses/create");
    };

    const totalCourses = createdCourses.length;

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={false}
                showCourses={true}
                showProfile={true}
            />

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
                                title="Hello,"
                                subtitle="Manage your courses and create new learning experiences."
                            />
                        </div>

                        {/* Quick Stats Cards - Only courses count */}
                        <div className="flex gap-3 sm:gap-4">
                            <StatsCard
                                icon={BookOpen}
                                label="My Courses"
                                value={totalCourses}
                                color="teal"
                                gradient="linear-gradient(145deg, hsla(174, 70%, 40%, 0.15) 0%, hsla(174, 70%, 40%, 0.05) 100%)"
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

                {/* Created Courses Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <SectionHeader
                            icon={BookOpen}
                            title="My Created Courses"
                        />

                        {/* Create Course Button - Next to the header */}
                        {/* New Course Button - styled like all other add buttons */}
                        <button
                            onClick={handleCreateCourse}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Course
                        </button>
                    </div>

                    {isLoading ? (
                        <LoadingState message="Loading, wait a sec..." />
                    ) : createdCourses.length > 0 ? (
                        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {createdCourses.map((course, index) => (
                                <TeacherCourseCard
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
                            title="No courses created yet"
                            description="Start sharing your knowledge by creating your first course"
                            actionText="Create Course"
                            actionLink={"/courses/create"}
                        />
                    )}
                </section>

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default TeacherHomePage;
