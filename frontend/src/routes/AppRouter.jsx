import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
