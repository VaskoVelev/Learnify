import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import CreateCoursePage from "../pages/teacher/CreateCoursePage"

const CreateCourseWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <CreateCoursePage />;
};

export default CreateCourseWrapper;