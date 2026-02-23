import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import CreateLessonPage from "../pages/teacher/CreateLessonPage"

const CreateLessonWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <CreateLessonPage />;
};

export default CreateLessonWrapper;