import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllEnrollments } from "../../api/enrollment.api";
import { deleteEnrollment } from "../../api/enrollment.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    WelcomeBadge,
    WelcomeSection,
    StatsCard,
    SectionHeader,
    AdminEnrollmentsList,
    ConfirmationModal
} from "../../components";
import { Shield, Users, BookOpen, Sparkles, GraduationCap } from "lucide-react";

const AdminPanelPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);

    const fetchEnrollments = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getAllEnrollments();
            setEnrollments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
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

    const handleDeleteClick = (studentId, courseId, studentName, courseTitle) => {
        setEnrollmentToDelete({ studentId, courseId, studentName, courseTitle });
        setShowDeleteModal(true);
    };

    const handleDeleteEnrollment = async () => {
        if (!enrollmentToDelete) return;

        try {
            setIsLoading(true);
            await deleteEnrollment(enrollmentToDelete.studentId, enrollmentToDelete.courseId);

            // Refresh the list
            await fetchEnrollments();

            setShowDeleteModal(false);
            setEnrollmentToDelete(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate stats
    const totalEnrollments = enrollments.length;
    const uniqueStudents = new Set(enrollments.map(e => e.studentId)).size;
    const uniqueCourses = new Set(enrollments.map(e => e.courseId)).size;
    const uniqueTeachers = new Set(enrollments.map(e => e.teacherId)).size;

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={false}
                showCourses={false}
                showProfile={true}
            />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                {/* Welcome Section - Like home page */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <WelcomeBadge
                                text="Admin Panel"
                                icon={Sparkles}
                                className="mb-3"
                            />

                            <WelcomeSection
                                coloredText={user?.firstName}
                                title="Hello,"
                                subtitle="Manage all enrollments across the platform."
                            />
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="flex gap-3 sm:gap-4">
                            <StatsCard
                                icon={Users}
                                label="Enrollments"
                                value={totalEnrollments}
                                color="purple"
                                gradient="linear-gradient(145deg, hsla(270, 70%, 50%, 0.15) 0%, hsla(270, 70%, 50%, 0.05) 100%)"
                            />
                            <StatsCard
                                icon={Users}
                                label="Students"
                                value={uniqueStudents}
                                color="cyan"
                                gradient="linear-gradient(145deg, hsla(199, 85%, 45%, 0.15) 0%, hsla(199, 85%, 45%, 0.05) 100%)"
                            />
                            <StatsCard
                                icon={GraduationCap}
                                label="Teachers"
                                value={uniqueTeachers}
                                color="rose" // Changed to rose
                                gradient="linear-gradient(145deg, hsla(0, 84%, 60%, 0.15) 0%, hsla(0, 84%, 60%, 0.05) 100%)"
                            />
                            <StatsCard
                                icon={BookOpen}
                                label="Courses"
                                value={uniqueCourses}
                                color="amber"
                                gradient="linear-gradient(145deg, hsla(45, 85%, 50%, 0.15) 0%, hsla(45, 85%, 50%, 0.05) 100%)"
                                hiddenOnMobile={true}
                            />
                        </div>
                    </div>
                </div>

                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {/* Delete Enrollment Modal */}
                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setEnrollmentToDelete(null);
                    }}
                    onConfirm={handleDeleteEnrollment}
                    title="Delete Enrollment"
                    message={enrollmentToDelete ?
                        `Are you sure you want to delete ${enrollmentToDelete.studentName}'s enrollment in "${enrollmentToDelete.courseTitle}"? This action cannot be undone and will delete all student progress and submissions for this course.`
                        : ""}
                    confirmText="Delete Enrollment"
                    type="danger"
                />

                {/* Enrollments Section */}
                <section>
                    <SectionHeader
                        icon={Shield}
                        title="All Enrollments"
                    />

                    {isLoading ? (
                        <LoadingState message="Loading, wait a sec..." />
                    ) : (
                        <AdminEnrollmentsList
                            enrollments={enrollments}
                            onDeleteEnrollment={handleDeleteClick}
                        />
                    )}
                </section>

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default AdminPanelPage;