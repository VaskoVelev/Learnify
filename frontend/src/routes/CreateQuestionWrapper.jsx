import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import CreateQuestionPage from "../pages/teacher/CreateQuestionPage"

const CreateQuestionWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <CreateQuestionPage />;
};

export default CreateQuestionWrapper;