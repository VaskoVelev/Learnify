import { useAuth } from "../context/AuthContext";
import QuizSubmissionsPage from "../pages/student/QuizSubmissionsPage";
import TeacherQuizSubmissionsPage from "../pages/teacher/TeacherQuizSubmissionsPage";
import ForbiddenPage from "../pages/ForbiddenPage";

const QuizSubmissionsPageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherQuizSubmissionsPage />;
    }

    return <QuizSubmissionsPage />;
};

export default QuizSubmissionsPageWrapper;