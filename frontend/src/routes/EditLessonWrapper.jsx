import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import EditLessonPage from "../pages/teacher/EditLessonPage"

const EditLessonWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <EditLessonPage />;
};

export default EditLessonWrapper;