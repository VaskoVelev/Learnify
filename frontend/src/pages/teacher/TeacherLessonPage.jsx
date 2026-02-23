import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLesson, deleteLesson } from "../../api/lesson.api";
import { getLessonMaterials, deleteMaterial } from "../../api/material.api";
import { getLessonQuizzes } from "../../api/quiz.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    BackButton,
    LessonHeader,
    VideoPlayer,
    LessonContent,
    MaterialsList,
    QuizzesList,
    ConfirmationModal
} from "../../components";
import { getFileName, isValidFileUrl, getFileDownloadError, isVideoAvailable } from "../../utils";

const TeacherLessonPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const [lesson, setLesson] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadError, setDownloadError] = useState(null);
    const [downloadingMaterialId, setDownloadingMaterialId] = useState(null);
    const [showDeleteLessonModal, setShowDeleteLessonModal] = useState(false);
    const [materialToDelete, setMaterialToDelete] = useState(null);

    const fetchLessonData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const lessonData = await getLesson(lessonId);
            setLesson(lessonData);

            const materialsData = await getLessonMaterials(lessonId);
            setMaterials(materialsData);

            const quizzesData = await getLessonQuizzes(lessonId);
            setQuizzes(quizzesData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLessonData();
    }, [lessonId]);

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

    const handleQuizClick = (quizId) => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}`);
    };

    const handleMaterialDownload = async (material) => {
        const fileName = getFileName(material.filePath);

        if (!isValidFileUrl(material.filePath)) {
            setDownloadError(`"${fileName}" has an invalid download URL.`);
            return;
        }

        setDownloadingMaterialId(material.id);
        setDownloadError(null);

        try {
            if (material.fileType?.toLowerCase() === 'pdf') {
                window.open(material.filePath, '_blank', 'noopener,noreferrer');
                setDownloadingMaterialId(null);
                return;
            }

            const response = await fetch(material.filePath, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });

            if (!response.ok) {
                setDownloadError(getFileDownloadError(fileName, response.status));
                setDownloadingMaterialId(null);
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                setDownloadError(`"${fileName}" appears to be unavailable or corrupted.`);
                setDownloadingMaterialId(null);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
                setDownloadingMaterialId(null);
            }, 100);

        } catch (err) {
            setDownloadingMaterialId(null);

            if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
                setDownloadError(`Cannot connect to download server for "${fileName}".`);
            } else {
                setDownloadError(`An unexpected error occurred while downloading "${fileName}".`);
            }
        }
    };

    const handleEditLesson = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/edit`);
    };

    const handleDeleteLesson = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await deleteLesson(lessonId);
            navigate(`/courses/${courseId}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }

        setShowDeleteLessonModal(false);
    };

    const handleAddMaterial = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/materials/create`);
    };

    const handleDeleteMaterial = async (materialId) => {
        setIsLoading(true);
        setError(null);

        try {
            await deleteMaterial(materialId);
            const updatedMaterials = materials.filter(m => m.id !== materialId);

            setMaterials(updatedMaterials);
            setMaterialToDelete(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddQuiz = () => {
        navigate(`/courses/${courseId}/lessons/${lessonId}/quizzes/create`);
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
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">

                {/* Error displays */}
                <GlobalError
                    error={error}
                    onDismiss={() => setError(null)}
                    type="error"
                />
                <GlobalError
                    error={downloadError}
                    onDismiss={() => setDownloadError(null)}
                    type="error"
                />

                {/* Delete lesson confirmation modal */}
                <ConfirmationModal
                    isOpen={showDeleteLessonModal}
                    onClose={() => setShowDeleteLessonModal(false)}
                    onConfirm={handleDeleteLesson}
                    title="Delete Lesson"
                    message="Are you sure you want to delete this lesson? This action cannot be undone and will also delete all materials and quizzes."
                    confirmText="Delete Lesson"
                    type="danger"
                />

                {/* Delete material confirmation modal */}
                <ConfirmationModal
                    isOpen={!!materialToDelete}
                    onClose={() => setMaterialToDelete(null)}
                    onConfirm={() => handleDeleteMaterial(materialToDelete)}
                    title="Delete Material"
                    message="Are you sure you want to delete this material? This action cannot be undone."
                    confirmText="Delete Material"
                    type="danger"
                />

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <>
                        {/* Back navigation */}
                        <BackButton
                            onClick={() => navigate(`/courses/${courseId}`)}
                            text="Back to Course"
                        />

                        {/* Lesson header */}
                        <LessonHeader
                            title={lesson?.title}
                            onEdit={handleEditLesson}
                            onDelete={() => setShowDeleteLessonModal(true)}
                        />

                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Left column - Main lesson content (view only) */}
                            <div className="lg:col-span-2 space-y-8">
                                <VideoPlayer
                                    videoUrl={lesson?.videoUrl}
                                    title={lesson?.title}
                                    isAvailable={isVideoAvailable(lesson?.videoUrl)}
                                />
                                <LessonContent content={lesson?.content} />
                            </div>

                            {/* Right column - Sidebar with management buttons */}
                            <div className="lg:col-span-1 space-y-6">

                                {/* Materials list */}
                                <MaterialsList
                                    materials={materials}
                                    onDownload={handleMaterialDownload}
                                    showAddButton={true}
                                    onAddClick={handleAddMaterial}
                                    onDelete={(id) => setMaterialToDelete(id)}
                                />

                                {/* Quizzes list */}
                                <QuizzesList
                                    quizzes={quizzes}
                                    onQuizClick={handleQuizClick}
                                    showAddButton={true}
                                    onAddClick={handleAddQuiz}
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* Page footer */}
                <Footer />
            </main>
        </GradientBackground>
    );
};

export default TeacherLessonPage;