import { useAuth } from "../context/AuthContext";
import ForbiddenPage from "../pages/ForbiddenPage";
import CreateMaterialPage from "../pages/teacher/CreateMaterialPage"

const CreateMaterialWrapper = () => {
    const { user } = useAuth();

    const allowedRoles = ["TEACHER"];

    if (!allowedRoles.includes(user?.role)) {
        return <ForbiddenPage />;
    }

    return <CreateMaterialPage />;
};

export default CreateMaterialWrapper;