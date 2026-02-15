import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import HomePageWrapper from "./HomePageWrapper";

import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import UpdateProfilePage from "../pages/UpdateProfilePage";

import CoursesPage from "../pages/student/CoursesPage";
import CoursePage from "../pages/student/CoursePage";
import LessonPage from "../pages/student/LessonPage";
import QuizPage from "../pages/student/QuizPage";
import QuizReviewPage from "../pages/student/QuizReviewPage";

const AppRouter = () => {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/" element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePageWrapper />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<UpdateProfilePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId" element={<QuizPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/submissions/:submissionId/review" element={<QuizReviewPage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
