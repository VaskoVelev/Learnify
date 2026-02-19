import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getQuiz } from "../../api/quiz.api";
import { getQuizQuestions } from "../../api/question.api";
import { getQuestionAnswers } from "../../api/answer.api";
import { submitQuiz, getMyQuizSubmissions } from "../../api/submission.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    BackButton,
    QuizHeader,
    QuestionCard,
    QuizSubmissionBanner,
    QuizResultCard,
    SubmitButton
} from "../../components";

const QuizPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, quizId } = useParams();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [previousSubmissions, setPreviousSubmissions] = useState([]);
    const [hasPreviousSubmissions, setHasPreviousSubmissions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuizData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const quizData = await getQuiz(quizId);
            setQuiz(quizData);

            const questionsData = await getQuizQuestions(quizId);

            const questionsWithAnswers = await Promise.all(
                questionsData.map(async (question) => {
                    try {
                        const answers = await getQuestionAnswers(question.id);
                        return {
                            ...question,
                            answers: Array.isArray(answers) ? answers : []
                        };
                    } catch (err) {
                        return { ...question, answers: [] };
                    }
                })
            );

            setQuestions(questionsWithAnswers);

            // Check if student has previous submissions
            try {
                const submissions = await getMyQuizSubmissions(quizId);
                setPreviousSubmissions(submissions);
                setHasPreviousSubmissions(submissions.length > 0);
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setHasPreviousSubmissions(false);
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizData();
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

    const handleSelectAnswer = (questionId, answerId) => {
        if (isSubmitted) {
            return;
        }

        setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setError(null);

            const answers = Object.entries(selectedAnswers).map(([questionId, answerId]) => ({
                questionId: parseInt(questionId),
                answerId: parseInt(answerId)
            }));

            const result = await submitQuiz(quizId, answers);
            setSubmission(result);
            setIsSubmitted(true);

            // Update previous submissions count
            setHasPreviousSubmissions(true);
            setPreviousSubmissions(prev => [...prev, result]);

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckAnswers = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submissions/${submission.id}/review`);
    };

    const handleViewSubmissions = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submissions`);
    };

    const answeredCount = Object.keys(selectedAnswers).length;
    const totalQuestions = questions.length;
    const allAnswered = answeredCount === totalQuestions;

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={false}
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
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <>
                        {isSubmitted && submission ? (
                            // Show ONLY the result card when submitted - no header, no questions
                            <QuizResultCard
                                submission={submission}
                                onCheckAnswers={handleCheckAnswers}
                            />
                        ) : (
                            // Show quiz content when not submitted
                            <>
                                <QuizHeader
                                    title={quiz?.title}
                                    description={quiz?.description}
                                    totalQuestions={totalQuestions}
                                    answeredCount={answeredCount}
                                    hasSubmissions={hasPreviousSubmissions}
                                    onViewSubmissions={handleViewSubmissions}
                                />

                                <div className="space-y-8">
                                    {questions.map((question, index) => (
                                        <QuestionCard
                                            key={question.id}
                                            question={question}
                                            index={index}
                                            selectedAnswer={selectedAnswers[question.id]}
                                            onSelectAnswer={handleSelectAnswer}
                                            isSubmitted={isSubmitted}
                                        />
                                    ))}
                                </div>

                                <SubmitButton
                                    allAnswered={allAnswered}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            </>
                        )}
                    </>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default QuizPage;