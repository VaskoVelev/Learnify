import { useAuth } from "../context/AuthContext";
import QuizPage from "../pages/student/QuizPage";
import TeacherQuizPage from "../pages/teacher/TeacherQuizPage";
import ForbiddenPage from "../pages/ForbiddenPage";

const QuizPageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherQuizPage />;
    }

    return <QuizPage />;
};

export default QuizPageWrapper;