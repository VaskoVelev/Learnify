import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createQuiz } from "../../api/quiz.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    BackButton,
    QuizForm,
    LoadingState
} from "../../components";
import { HelpCircle } from "lucide-react";

const CreateQuizPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const [form, setForm] = useState({
        title: "",
        description: ""
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

    const handleTitleChange = (e) => {
        setForm({ ...form, title: e.target.value });
    };

    const handleDescriptionChange = (e) => {
        setForm({ ...form, description: e.target.value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            const newQuiz = await createQuiz(lessonId, form);
            navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${newQuiz.id}`);
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}`);
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
                    title="Create New Quiz"
                    subtitle="Test your students' knowledge with a new quiz"
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
                            <QuizForm
                                form={form}
                                onTitleChange={handleTitleChange}
                                onDescriptionChange={handleDescriptionChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                                submitButtonText="Create Quiz"
                                loadingText="Creating Quiz..."
                            />
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default CreateQuizPage;