import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import EditCoursePage from "../pages/teacher/EditCoursePage"

const EditCourseWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <EditCoursePage />;
};

export default EditCourseWrapper;