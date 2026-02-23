import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import CreateQuizPage from "../pages/teacher/CreateQuizPage"

const CreateQuizWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <CreateQuizPage />;
};

export default CreateQuizWrapper;