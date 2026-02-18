import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createQuestion } from "../../api/question.api";
import { createAnswer } from "../../api/answer.api";
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

const CreateQuestionPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId, quizId } = useParams();

    const [form, setForm] = useState({
        text: "",
        answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ]
    });

    const [globalError, setGlobalError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            // First create the question
            const newQuestion = await createQuestion(quizId, { text: form.text });

            // Then create all answers for this question
            await Promise.all(
                form.answers.map(answer =>
                    createAnswer(newQuestion.id, {
                        text: answer.text,
                        isCorrect: answer.isCorrect
                    })
                )
            );

            // Navigate back to the quiz page
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

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={false}
                showProfile={true}
            />

            <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
                <PageHeader
                    title="Create New Question"
                    subtitle="Add a new question to your quiz"
                />

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
                        {/* Form */}
                        <div className="p-8">
                            <QuestionForm
                                form={form}
                                onTextChange={handleTextChange}
                                onAnswersChange={handleAnswersChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                                submitButtonText="Create Question"
                                loadingText="Creating Question..."
                            />
                        </div>
                    </div>
                )}


                <Footer />
            </main>
        </GradientBackground>
    );
};

export default CreateQuestionPage;