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
        try {
            setIsLoading(true);
            setError(null);

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

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const answers = submission?.answers;

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={true}
                showProfile={true}
            />

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                <BackButton
                    onClick={() => navigate(`/courses/${courseId}/lessons/${lessonId}`)}
                    text="Back to Lesson"
                />

                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading review..." />
                ) : submission ? (
                    <>
                        <ReviewResultCard
                            submission={submission}
                            formatDate={formatDate}
                        />

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

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default QuizReviewPage;