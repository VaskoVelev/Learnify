import { useAuth } from "../context/AuthContext";
import StudentHomePage from "../pages/student/StudentHomePage";
import TeacherHomePage from "../pages/teacher/TeacherHomePage";
import ForbiddenPage from "../pages/ForbiddenPage";

const HomePageWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["STUDENT", "TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    if (user?.role === "TEACHER") {
        return <TeacherHomePage />;
    }

    return <StudentHomePage />;
};

export default HomePageWrapper;
