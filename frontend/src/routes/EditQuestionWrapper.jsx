import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import EditQuestionPage from "../pages/teacher/EditQuestionPage"

const EditQuestionWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <EditQuestionPage />;
};

export default EditQuestionWrapper;