import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import HomePageWrapper from "./HomePageWrapper";
import CoursesPageWrapper from "./CoursesPageWrapper";
import CoursePageWrapper from "./CoursePageWrapper";
import LessonPageWrapper from "./LessonPageWrapper";

import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import UpdateProfilePage from "../pages/UpdateProfilePage";

import QuizPage from "../pages/student/QuizPage";
import QuizReviewPage from "../pages/student/QuizReviewPage";
import CreateCoursePage from "../pages/teacher/CreateCoursePage";
import EditCoursePage from "../pages/teacher/EditCoursePage";
import CreateLessonPage from "../pages/teacher/CreateLessonPage";
import EditLessonPage from "../pages/teacher/EditLessonPage";
import CreateMaterialPage from "../pages/teacher/CreateMaterialPage";
import CreateQuizPage from "../pages/teacher/CreateQuizPage";

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
                <Route path="/courses" element={<CoursesPageWrapper />} />
                <Route path="/courses/create" element={<CreateCoursePage />} />
                <Route path="/courses/:courseId" element={<CoursePageWrapper />} />
                <Route path="/courses/:courseId/edit" element={<EditCoursePage />} />
                <Route path="/courses/:courseId/lessons/create" element={<CreateLessonPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPageWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/edit" element={<EditLessonPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/materials/create" element={<CreateMaterialPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId" element={<QuizPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/create" element={<CreateQuizPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/submissions/:submissionId/review" element={<QuizReviewPage />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;