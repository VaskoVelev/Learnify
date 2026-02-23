import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSubmission } from "../../api/submission.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    BackButton,
    ReviewResultCard,
    ReviewQuestionCard
} from "../../components";

const QuizReviewPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, submissionId } = useParams();

    const [submission, setSubmission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubmission = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const submissionData = await getSubmission(submissionId);
            submissionData.answers.sort((a, b) => a.questionId - b.questionId);
            setSubmission(submissionData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmission();
    }, [submissionId]);

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

    const answers = submission?.answers;

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
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">

                {/* Back navigation */}
                <BackButton
                    onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                    text="Back to Lesson"
                />

                {/* Error display */}
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : submission ? (
                    <>
                        {/* Submission summary card */}
                        <ReviewResultCard submission={submission} />

                        {/* Question review list */}
                        <div className="space-y-8">
                            {answers.map((answer, index) => (
                                <ReviewQuestionCard
                                    key={answer.questionId}
                                    answer={answer}
                                    index={index}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center p-12">
                        <p className="text-white/60">No submission data found.</p>
                    </div>
                )}

                {/* Page footer */}
                <Footer />
            </main>
        </GradientBackground>
    );
};

export default QuizReviewPage;