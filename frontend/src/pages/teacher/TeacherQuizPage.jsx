import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getQuiz } from "../../api/quiz.api";
import { getQuizQuestions } from "../../api/question.api";
import { getQuestionAnswers } from "../../api/answer.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    BackButton,
    QuizHeader,
    QuestionCard
} from "../../components";
import { PlusCircle } from "lucide-react";

const TeacherQuizPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, quizId } = useParams();

    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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

    const handleEditQuestion = (questionId) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/questions/${questionId}/edit`);
    };

    const handleAddQuestion = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/questions/create`);
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
                        {/* Quiz Header with integrated Edit button */}
                        <QuizHeader
                            title={quiz?.title}
                            description={quiz?.description}
                            totalQuestions={questions.length}
                            onEdit={handleEditQuiz}
                        />

                        {/* Add Question Button - same style as other teacher pages */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleAddQuestion}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Add Question
                            </button>
                        </div>

                        {/* Questions - Not selectable, with edit buttons */}
                        <div className="space-y-8">
                            {questions.map((question, index) => (
                                <QuestionCard
                                    key={question.id}
                                    question={question}
                                    index={index}
                                    showEditButton={true}
                                    onEditClick={handleEditQuestion}
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