import { useAuth } from "../context/AuthContext";
import LessonPage from "../pages/student/LessonPage";
import TeacherLessonPage from "../pages/teacher/TeacherLessonPage";
import ForbiddenPage from "../pages/ForbiddenPage";

const LessonPageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherLessonPage />;
    }

    return <LessonPage />;
};

export default LessonPageWrapper;