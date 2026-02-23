import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllEnrollments } from "../../api/enrollment.api";
import { deleteEnrollment } from "../../api/enrollment.api";
import { getAllUsers, toggleUserActive } from "../../api/user.api";
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
    AdminUsersList,
    ConfirmationModal
} from "../../components";
import { Shield, Users, BookOpen, Sparkles, GraduationCap } from "lucide-react";

const AdminPanelPage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [enrollmentToDelete, setEnrollmentToDelete] = useState(null);

    // Add state for user toggle confirmation
    const [showUserToggleModal, setShowUserToggleModal] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [enrollmentsData, usersData] = await Promise.all([
                getAllEnrollments(),
                getAllUsers()
            ]);

            setEnrollments(enrollmentsData);
            setUsers(usersData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
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

            // Refresh the data
            await fetchData();

            setShowDeleteModal(false);
            setEnrollmentToDelete(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle user toggle click - shows confirmation modal
    const handleToggleClick = (userId, firstName, lastName, newStatus) => {
        setUserToToggle({ userId, firstName, lastName, newStatus });
        setShowUserToggleModal(true);
    };

    const handleToggleUser = async () => {
        if (!userToToggle) return;

        try {
            setIsLoading(true);

            // Call the API to toggle user active status
            await toggleUserActive(userToToggle.userId, userToToggle.newStatus);

            // Refresh the users list
            await fetchData();

            // Close modal
            setShowUserToggleModal(false);
            setUserToToggle(null);
        } catch (err) {
            setError(`Failed to ${userToToggle.newStatus ? 'activate' : 'deactivate'} user: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate stats
    const totalEnrollments = enrollments.length;
    const uniqueStudents = new Set(enrollments.map(e => e.studentId)).size;
    const uniqueCourses = new Set(enrollments.map(e => e.courseId)).size;
    const uniqueTeachers = new Set(enrollments.map(e => e.teacherId)).size;

    // User stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.active).length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;
    const teacherCount = users.filter(u => u.role === 'TEACHER').length;
    const studentCount = users.filter(u => u.role === 'STUDENT').length;

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
                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <>
                        {/* Welcome Section */}
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
                                        subtitle="Manage users and enrollments across the platform."
                                    />
                                </div>

                                {/* Quick Stats Cards */}
                                <div className="flex gap-3 sm:gap-4">
                                    <StatsCard
                                        icon={Users}
                                        label="Total Users"
                                        value={totalUsers}
                                        color="blue"
                                        gradient="linear-gradient(145deg, hsla(210, 70%, 50%, 0.15) 0%, hsla(210, 70%, 50%, 0.05) 100%)"
                                    />
                                    <StatsCard
                                        icon={Users}
                                        label="Active"
                                        value={activeUsers}
                                        color="emerald"
                                        gradient="linear-gradient(145deg, hsla(160, 84%, 50%, 0.15) 0%, hsla(160, 84%, 50%, 0.05) 100%)"
                                    />
                                    <StatsCard
                                        icon={BookOpen}
                                        label="Enrollments"
                                        value={totalEnrollments}
                                        color="purple"
                                        gradient="linear-gradient(145deg, hsla(270, 70%, 50%, 0.15) 0%, hsla(270, 70%, 50%, 0.05) 100%)"
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

                        {/* User Toggle Confirmation Modal */}
                        <ConfirmationModal
                            isOpen={showUserToggleModal}
                            onClose={() => {
                                setShowUserToggleModal(false);
                                setUserToToggle(null);
                            }}
                            onConfirm={handleToggleUser}
                            title={userToToggle?.newStatus ? "Activate User" : "Deactivate User"}
                            message={userToToggle ?
                                `Are you sure you want to ${userToToggle.newStatus ? 'activate' : 'deactivate'} ${userToToggle.firstName} ${userToToggle.lastName}? ${
                                    userToToggle.newStatus
                                        ? 'This will allow them to access the platform again.'
                                        : 'They will no longer be able to log in or access any courses.'
                                }`
                                : ""}
                            confirmText={userToToggle?.newStatus ? "Activate" : "Deactivate"}
                            type={userToToggle?.newStatus ? "warning" : "danger"}
                        />

                        {/* Two-column layout for lists */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Users List */}
                            <section>
                                <SectionHeader
                                    icon={Shield}
                                    title="User Management"
                                />
                                <AdminUsersList
                                    users={users}
                                    currentUserId={user?.id}
                                    currentUserRole={user?.role}
                                    onToggleActive={handleToggleClick}
                                />
                            </section>

                            {/* Enrollments List */}
                            <section>
                                <SectionHeader
                                    icon={Shield}
                                    title="Enrollment Management"
                                />
                                <AdminEnrollmentsList
                                    enrollments={enrollments}
                                    onDeleteEnrollment={handleDeleteClick}
                                />
                            </section>
                        </div>

                        {/* Stats breakdown */}
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-white/40 text-xs mb-1">Admins</p>
                                <p className="text-2xl font-bold text-purple-400">{adminCount}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-white/40 text-xs mb-1">Teachers</p>
                                <p className="text-2xl font-bold text-amber-400">{teacherCount}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-white/40 text-xs mb-1">Students</p>
                                <p className="text-2xl font-bold text-cyan-400">{studentCount}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <p className="text-white/40 text-xs mb-1">Inactive</p>
                                <p className="text-2xl font-bold text-rose-400">{totalUsers - activeUsers}</p>
                            </div>
                        </div>
                    </>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default AdminPanelPage;