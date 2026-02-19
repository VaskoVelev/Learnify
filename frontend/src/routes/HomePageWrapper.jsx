import { useAuth } from "../context/AuthContext";
import StudentHomePage from "../pages/student/StudentHomePage";
import TeacherHomePage from "../pages/teacher/TeacherHomePage";
import AdminPanelPage from "../pages/admin/AdminPanelPage";
import ForbiddenPage from "../pages/ForbiddenPage";

const HomePageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER", "ADMIN"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "ADMIN") {
        return <AdminPanelPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherHomePage />;

    }

    return <StudentHomePage />;
};

export default HomePageWrapper;