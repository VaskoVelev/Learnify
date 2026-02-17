import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createCourse } from "../../api/course.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    CourseForm
} from "../../components";
import { BookOpen } from "lucide-react";

const CreateCoursePage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        difficulty: ""
    });

    const [globalError, setGlobalError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

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

    const handleCategoryChange = (value) => {
        setForm({ ...form, category: value });
    };

    const handleDifficultyChange = (value) => {
        setForm({ ...form, difficulty: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            const newCourse = await createCourse(form);
            navigate(`/courses/${newCourse.id}`);
        } catch (err) {
            setGlobalError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate("/home");
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
                    title="Create New Course"
                    subtitle="Share your knowledge by creating a new course"
                />

                <GlobalError
                    error={globalError}
                    onDismiss={() => setGlobalError(null)}
                    type="error"
                />

                <div
                    className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                    style={{
                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                    }}
                >
                    {/* Form */}
                    <div className="p-8">
                        <CourseForm
                            form={form}
                            onTitleChange={handleChange}
                            onDescriptionChange={handleChange}
                            onCategoryChange={handleCategoryChange}
                            onDifficultyChange={handleDifficultyChange}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                            submitButtonText="Create Course"
                            loadingText="Creating Course..."
                        />
                    </div>
                </div>

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default CreateCoursePage;