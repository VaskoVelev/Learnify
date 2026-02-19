import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getQuiz, deleteQuiz } from "../../api/quiz.api";
import { getQuizQuestions, deleteQuestion } from "../../api/question.api";
import { getQuestionAnswers } from "../../api/answer.api";
import { getQuizSubmissions } from "../../api/submission.api";
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
    ConfirmationModal
} from "../../components";
import { PlusCircle } from "lucide-react";

const TeacherQuizPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, quizId } = useParams();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [hasSubmissions, setHasSubmissions] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteQuizModal, setShowDeleteQuizModal] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState(null);

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

            // Check if quiz has any submissions
            try {
                const submissions = await getQuizSubmissions(quizId);
                setHasSubmissions(submissions.length > 0);
            } catch (err) {
                console.error("Error fetching submissions:", err);
                setHasSubmissions(false);
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

    const handleEditQuiz = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/edit`);
    };

    const handleDeleteQuiz = async () => {
        try {
            setIsLoading(true);
            await deleteQuiz(quizId);
            navigate(`/courses/${courseId}/lessons/${lessonId}`);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
        setShowDeleteQuizModal(false);
    };

    const handleEditQuestion = (questionId) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/questions/${questionId}/edit`);
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            await deleteQuestion(questionId);
            const updatedQuestions = questions.filter(q => q.id !== questionId);
            setQuestions(updatedQuestions);
            setQuestionToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddQuestion = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/questions/create`);
    };

    const handleViewSubmissions = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submissions`);
    };

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
                />

                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />

                <ConfirmationModal
                    isOpen={showDeleteQuizModal}
                    onClose={() => setShowDeleteQuizModal(false)}
                    onConfirm={handleDeleteQuiz}
                    title="Delete Quiz"
                    message="Are you sure you want to delete this quiz? This action cannot be undone and will also delete all questions and answers."
                    confirmText="Delete Quiz"
                    type="danger"
                />

                <ConfirmationModal
                    isOpen={!!questionToDelete}
                    onClose={() => setQuestionToDelete(null)}
                    onConfirm={() => handleDeleteQuestion(questionToDelete)}
                    title="Delete Question"
                    message="Are you sure you want to delete this question? This action cannot be undone."
                    confirmText="Delete Question"
                    type="danger"
                />

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <>
                        {/* Quiz Header with integrated buttons */}
                        <QuizHeader
                            title={quiz?.title}
                            description={quiz?.description}
                            totalQuestions={questions.length}
                            onEdit={handleEditQuiz}
                            onDelete={() => setShowDeleteQuizModal(true)}
                            onViewSubmissions={hasSubmissions ? handleViewSubmissions : undefined}
                            hasSubmissions={hasSubmissions}
                        />

                        {/* Add Question Button */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleAddQuestion}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Question
                            </button>
                        </div>

                        {/* Questions */}
                        <div className="space-y-8">
                            {questions.map((question, index) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    showEditButton={true}
                                    showDeleteButton={true}
                                    onEditClick={handleEditQuestion}
                                    onDeleteClick={() => setQuestionToDelete(question.id)}
                                    isTeacher={true}
                                />
                            ))}
                        </div>
                    </>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default TeacherQuizPage;