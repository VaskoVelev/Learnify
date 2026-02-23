import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getQuizQuestions, updateQuestion } from "../../api/question.api";
import { getQuestionAnswers, updateAnswer, deleteAnswer, createAnswer } from "../../api/answer.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    BackButton,
    QuestionForm,
    LoadingState
} from "../../components";
import { HelpCircle } from "lucide-react";

const EditQuestionPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, quizId, questionId } = useParams();

    const [form, setForm] = useState({
        text: "",
        answers: []
    });

    const [globalError, setGlobalError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchQuestion = async () => {
        setIsLoading(true);
        setGlobalError(null);

        try {
            const questionsData = await getQuizQuestions(quizId);

            const questionData = questionsData.find(q => q.id.toString() === questionId);
            const answersData = await getQuestionAnswers(questionId);
            const sortedAnswers = answersData.sort((a, b) => b.id - a.id);

            setForm({
                text: questionData.text,
                    answers: answersData.map(answer => ({
                        id: answer.id,
                        text: answer.text,
                        isCorrect: answer.correct
                    }))
                });
            } catch (err) {
                setGlobalError(err.message);
            } finally {
                setIsLoading(false);
            }
    };

    useEffect(() => {
        fetchQuestion();
    }, [quizId, questionId]);

    const handleLogout = async () => {
        setIsLoading(true);
        setGlobalError(null);

        try {
            await logout();
            navigate("/");
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTextChange = (e) => {
        setForm({ ...form, text: e.target.value });
    };

    const handleAnswersChange = (answers) => {
        setForm({ ...form, answers });
    };

    const handleDeleteAnswer = async (answerId) => {
        try {
            await deleteAnswer(answerId);
        } catch (err) {
            setGlobalError(err.message);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            await updateQuestion(questionId, { text: form.text });

            const existingAnswers = form.answers.filter(a => a.id);
            const newAnswers = form.answers.filter(a => !a.id);

            await Promise.all(
                existingAnswers.map(answer =>
                    updateAnswer(answer.id, {
                        text: answer.text,
                        isCorrect: answer.isCorrect
                    })
                )
            );

            await Promise.all(
                newAnswers.map(answer =>
                    createAnswer(questionId, {
                        text: answer.text,
                        isCorrect: answer.isCorrect
                    })
                )
            );

            navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`);
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`);
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
            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">

                {/* Page header */}
                <PageHeader
                    title="Edit Question"
                    subtitle="Update your question and answers"
                />

                {/* Error display */}
                <GlobalError
                    error={globalError}
                    onDismiss={() => setGlobalError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <div
                        className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                        style={{
                            background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                        }}
                    >
                        {/* Form container */}
                        <div className="p-8">
                            <QuestionForm
                                form={form}
                                onTextChange={handleTextChange}
                                onAnswersChange={handleAnswersChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                                onDeleteAnswer={handleDeleteAnswer}
                                submitButtonText="Update Question"
                                loadingText="Updating Question..."
                            />
                        </div>
                    </div>
                )}

                {/* Page footer */}
                <Footer />
            </main>
        </GradientBackground>
    );
};

export default EditQuestionPage;