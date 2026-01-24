import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<div>Home</div>} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
