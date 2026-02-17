import { useAuth } from "../context/AuthContext";
import CoursePage from "../pages/student/CoursePage";
import TeacherCoursePage from "../pages/teacher/TeacherCoursePage";
import ForbiddenPage from "../pages/ForbiddenPage";

const CoursePageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherCoursePage />;
    }

    return <CoursePage />;
};

export default CoursePageWrapper;