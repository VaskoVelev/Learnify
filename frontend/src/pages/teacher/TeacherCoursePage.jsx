import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourse } from "../../api/course.api";
import { getCourseLessons } from "../../api/lesson.api";
import { getCourseEnrollments } from "../../api/enrollment.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    CourseHeader,
    LessonsList,
    EnrolledStudentsList
} from "../../components";

const TeacherCoursePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourseData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const courseData = await getCourse(courseId);
            setCourse(courseData);

            const lessonsData = await getCourseLessons(courseId);
            setLessons(lessonsData);

            const studentsData = await getCourseEnrollments(courseId);
            setEnrolledStudents(studentsData);

            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setLessons([]);
            setEnrolledStudents([]);
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

    const handleCreateLesson = () => {
        navigate(`/courses/${courseId}/lessons/create`);
    };

    const handleEditCourse = () => {
        navigate(`/courses/${courseId}/edit`);
    };

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={false}
                showProfile={true}
            />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <div className="flex gap-8">
                        {/* Left Side - Main Content */}
                        <div className="flex-1">
                            <CourseHeader course={course} showCreator={false} onEdit={handleEditCourse}/>

                            <div className="mt-8">
                                {/* Lessons - Full width */}
                                <LessonsList
                                    lessons={lessons}
                                    onLessonClick={handleLessonClick}
                                    showCreateButton={true}
                                    onCreateClick={handleCreateLesson}
                                />
                            </div>
                        </div>

                        {/* Right Side - Enrolled Students List (fixed width) */}
                        <div className="w-80 flex-shrink-0">
                            <EnrolledStudentsList students={enrolledStudents} />
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default TeacherCoursePage;