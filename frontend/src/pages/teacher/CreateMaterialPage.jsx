import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createMaterial } from "../../api/material.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    PageHeader,
    BackButton,
    MaterialForm,
    LoadingState
} from "../../components";
import { Download } from "lucide-react";

const CreateMaterialPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const [form, setForm] = useState({
        filePath: "",
        fileType: ""
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

    const handleFilePathChange = (e) => {
        setForm({ ...form, filePath: e.target.value });
    };

    const handleFileTypeChange = (value) => {
        setForm({ ...form, fileType: value });
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setGlobalError(null);

        try {
            await createMaterial(lessonId, form);
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
                    title="Add New Material"
                    subtitle="Share additional learning resources with your students"
                />

                {/* Error display */}
                <GlobalError
                    error={globalError}
                    onDismiss={() => setGlobalError(null)}
                    type="error"
                />

                {isLoading ? (
                    <LoadingState message="Loading..." />
                ) : (
                    <div
                        className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                        style={{
                            background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                        }}
                    >
                        {/* Form container */}
                        <div className="p-8">
                            <MaterialForm
                                form={form}
                                onFilePathChange={handleFilePathChange}
                                onFileTypeChange={handleFileTypeChange}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                                submitButtonText="Add Material"
                                loadingText="Adding Material..."
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

export default CreateMaterialPage;