import { useAuth } from "../context/AuthContext";
import CoursesPage from "../pages/student/CoursesPage";
import TeacherCoursesPage from "../pages/teacher/TeacherCoursesPage";
import ForbiddenPage from "../pages/ForbiddenPage";

const CoursesPageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherCoursesPage />;
    }

    return <CoursesPage />;
};

export default CoursesPageWrapper;