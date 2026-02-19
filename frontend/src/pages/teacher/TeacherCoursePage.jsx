import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCourse, deleteCourse, getCourseProgressions } from "../../api/course.api";
import { getCourseLessons } from "../../api/lesson.api";
import { getCourseEnrollments, deleteEnrollment } from "../../api/enrollment.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    CourseHeader,
    LessonsList,
    TeacherEnrolledStudentsList,
    ConfirmationModal
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
    const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
    const [showKickModal, setShowKickModal] = useState(false);
    const [studentToKick, setStudentToKick] = useState(null);
    const [studentProgress, setStudentProgress] = useState([]);

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

            const progressData = await getCourseProgressions(courseId);
            setStudentProgress(progressData);

            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setLessons([]);
            setEnrolledStudents([]);
            setStudentProgress([]);
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

    const handleDeleteCourse = async () => {
        try {
            setIsLoading(true);
            await deleteCourse(courseId);
            navigate("/home");
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
        setShowDeleteCourseModal(false);
    };

    const handleKickClick = (studentId, firstName, lastName) => {
        setStudentToKick({ id: studentId, firstName, lastName });
        setShowKickModal(true);
    };

    const handleKickStudent = async () => {
        if (!studentToKick) return;

        try {
            setIsLoading(true);
            await deleteEnrollment(studentToKick.id, courseId);

            const updatedStudents = enrolledStudents.filter(s => s.id !== studentToKick.id);
            setEnrolledStudents(updatedStudents);

            setShowKickModal(false);
            setStudentToKick(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const studentsWithProgress = enrolledStudents.map(student => {
        const progress = studentProgress.find(p => p.studentId === student.id) || {
            progressionPercent: 0,
            averageScore: 0
        };

        return {
            ...student,
            progressionPercent: progress.progressionPercent,
            averageScore: progress.averageScore
        };
    });

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

                <ConfirmationModal
                    isOpen={showDeleteCourseModal}
                    onClose={() => setShowDeleteCourseModal(false)}
                    onConfirm={handleDeleteCourse}
                    title="Delete Course"
                    message="Are you sure you want to delete this course? This action cannot be undone and will also delete all lessons, materials, and quizzes."
                    confirmText="Delete Course"
                    type="danger"
                />

                <ConfirmationModal
                    isOpen={showKickModal}
                    onClose={() => {
                        setShowKickModal(false);
                        setStudentToKick(null);
                    }}
                    onConfirm={handleKickStudent}
                    title="Kick Student"
                    message={studentToKick ? `Are you sure you want to kick ${studentToKick.firstName} ${studentToKick.lastName} from this course? This will delete all their progress, quiz submissions, and they'll need to enroll again to continue.` : ""}
                    confirmText="Kick Student"
                    type="danger"
                />

                {isLoading ? (
                    <LoadingState message="Loading course details..." />
                ) : (
                    <div className="flex gap-8">
                        {/* Left Side - Main Content */}
                        <div className="flex-1">
                            <CourseHeader
                                course={course}
                                showCreator={false}
                                onEdit={handleEditCourse}
                                onDelete={() => setShowDeleteCourseModal(true)}
                            />

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

                        {/* Right Side - Enrolled Students List with Progress */}
                        <div className="w-96 flex-shrink-0">
                            <TeacherEnrolledStudentsList
                                students={studentsWithProgress}
                                onKickStudent={handleKickClick}
                            />
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default TeacherCoursePage;