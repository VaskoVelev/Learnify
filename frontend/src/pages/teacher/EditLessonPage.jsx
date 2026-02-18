import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLesson, updateLesson } from "../../api/lesson.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    BackButton,
    LessonForm,
    LoadingState
} from "../../components";

const EditLessonPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const [form, setForm] = useState({
        title: "",
        content: "",
        videoUrl: ""
    });

    const [globalError, setGlobalError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchLesson = async () => {
        try {
            setIsLoading(true);
            setGlobalError(null);

            const lessonData = await getLesson(lessonId);
            setForm({
                title: lessonData.title,
                content: lessonData.content,
                videoUrl: lessonData.videoUrl
            });
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLesson();
    }, [lessonId]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            await updateLesson(lessonId, form);
            navigate(`/courses/${courseId}/lessons/${lessonId}`);
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
                    title="Edit Lesson"
                    subtitle="Update your lesson information"
                />

                <GlobalError
                    error={globalError}
                    onDismiss={() => setGlobalError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading lesson data..." />
                ) : (
                    <div
                        className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                        style={{
                            background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                        }}
                    >
                        {/* Form */}
                        <div className="p-8">
                            <LessonForm
                                form={form}
                                onTitleChange={handleChange}
                                onContentChange={handleChange}
                                onVideoUrlChange={handleChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                                submitButtonText="Update Lesson"
                                loadingText="Updating Lesson..."
                            />
                        </div>
                    </div>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default EditLessonPage;