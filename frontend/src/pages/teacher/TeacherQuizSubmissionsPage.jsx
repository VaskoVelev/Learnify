import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getQuizSubmissions } from "../../api/submission.api";
import { getQuiz } from "../../api/quiz.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    BackButton,
    PageHeader,
    SubmissionCard
} from "../../components";
import { History, User } from "lucide-react";

const TeacherQuizSubmissionsPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, quizId } = useParams();

    const [quiz, setQuiz] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubmissions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const quizData = await getQuiz(quizId);
            setQuiz(quizData);

            const submissionsData = await getQuizSubmissions(quizId);
            setSubmissions(submissionsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [quizId]);

    const handleLogout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await logout();
            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmissionClick = (submissionId) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submissions/${submissionId}/review`);
    };

    return (
        <GradientBackground>
            <FloatingOrbs />

            {/* Navigation bar */}
            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={false}
                showProfile={true}
            />

            {/* Main content area */}
            <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">

                {/* Back navigation */}
                <BackButton
                    onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`)}
                    text="Back to Quiz"
                />

                {/* Page header */}
                <PageHeader
                    title="Quiz Submissions"
                    subtitle={`All student submissions for "${quiz?.title}"`}
                />

                {/* Error display */}
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : submissions.length > 0 ? (
                    <div className="space-y-4">
                        {submissions.map((submission) => (
                            <SubmissionCard
                                key={submission.id}
                                submission={submission}
                                onClick={() => handleSubmissionClick(submission.id)}
                                showStudentName={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <History className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No submissions yet</h3>
                        <p className="text-white/40">No students have taken this quiz yet.</p>
                    </div>
                )}

                {/* Page footer */}
                <Footer />
            </main>
        </GradientBackground>
    );
};

export default TeacherQuizSubmissionsPage;