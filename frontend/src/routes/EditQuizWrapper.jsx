import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import EditQuizPage from "../pages/teacher/EditQuizPage"

const EditQuizWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <EditQuizPage />;
};

export default EditQuizWrapper;