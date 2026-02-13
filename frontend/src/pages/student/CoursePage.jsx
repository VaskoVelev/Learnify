import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourse } from "../../api/course.api";
import { getMyProgression } from "../../api/course.api";
import { getCourseLessons } from "../../api/lesson.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    CourseHeader,
    ProgressCard,
    AverageScoreCard,
    LessonsList
} from "../../components";

const CoursePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
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
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={true}
                showProfile={true}
            />

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {/* Loading State */}
                {isLoading ? (
                    <LoadingState message="Loading course details..." />
                ) : (
                    <>
                        <CourseHeader
                            course={course}
                            difficultyColors={difficultyColors}
                            formatDate={formatDate}
                            getInitials={getInitials}
                        />

                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-1 space-y-6">
                                <ProgressCard progress={progress} />
                                <AverageScoreCard averageScore={progress?.averageScore} />
                            </div>

                            <div className="lg:col-span-2">
                                <LessonsList
                                    lessons={lessons}
                                    onLessonClick={handleLessonClick}
                                />
                            </div>
                        </div>
                    </>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default CoursePage;