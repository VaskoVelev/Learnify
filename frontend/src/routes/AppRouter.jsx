import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

import UpdateProfilePage from "../pages/UpdateProfilePage";
import QuizReviewPage from "../pages/student/QuizReviewPage";

import HomePageWrapper from "./HomePageWrapper";
import CoursesPageWrapper from "./CoursesPageWrapper";
import CoursePageWrapper from "./CoursePageWrapper";
import LessonPageWrapper from "./LessonPageWrapper";
import QuizPageWrapper from "./QuizPageWrapper";
import QuizSubmissionsPageWrapper from "./QuizSubmissionsPageWrapper";
import CreateCourseWrapper from "./CreateCourseWrapper";
import EditCourseWrapper from "./EditCourseWrapper";
import CreateLessonWrapper from "./CreateLessonWrapper";
import EditLessonWrapper from "./EditLessonWrapper";
import CreateMaterialWrapper from "./CreateMaterialWrapper";
import CreateQuizWrapper from "./CreateQuizWrapper";
import EditQuizWrapper from "./EditQuizWrapper";
import CreateQuestionWrapper from "./CreateQuestionWrapper";
import EditQuestionWrapper from "./EditQuestionWrapper";

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
                <Route path="/courses/create" element={<CreateCourseWrapper />} />
                <Route path="/courses/:courseId" element={<CoursePageWrapper />} />
                <Route path="/courses/:courseId/edit" element={<EditCourseWrapper />} />
                <Route path="/courses/:courseId/lessons/create" element={<CreateLessonWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPageWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/edit" element={<EditLessonWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/materials/create" element={<CreateMaterialWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/create" element={<CreateQuizWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId" element={<QuizPageWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/edit" element={<EditQuizWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/questions/create" element={<CreateQuestionWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/questions/:questionId/edit" element={<EditQuestionWrapper />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/submissions/:submissionId/review" element={<QuizReviewPage />} />
                <Route path="/courses/:courseId/lessons/:lessonId/quizzes/:quizId/submissions" element={<QuizSubmissionsPageWrapper />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;