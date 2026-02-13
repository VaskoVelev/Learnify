import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLesson } from "../../api/lesson.api";
import { getLessonMaterials } from "../../api/material.api";
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
    SidebarCard
} from "../../components";
import { Download, HelpCircle } from "lucide-react";

const LessonPage = () => {
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

    const fetchLessonData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const lessonData = await getLesson(lessonId);
            setLesson(lessonData);

            const materialsData = await getLessonMaterials(lessonId);
            setMaterials(materialsData);

            const quizzesData = await getLessonQuizzes(lessonId);
            setQuizzes(quizzesData);
        } catch (err) {
            setError(err.message);
            setMaterials([]);
            setQuizzes([]);
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
        if (!isValidFileUrl(material.filePath)) {
            setDownloadError(`"${getFileName(material.filePath)}" has an invalid download URL.`);
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
                if (response.status === 404) {
                    setDownloadError(`"${getFileName(material.filePath)}" was not found on the server.`);
                } else if (response.status === 403) {
                    setDownloadError(`You don't have permission to download "${getFileName(material.filePath)}".`);
                } else if (response.status >= 500) {
                    setDownloadError(`Server error while downloading "${getFileName(material.filePath)}".`);
                } else {
                    setDownloadError(`Unable to download "${getFileName(material.filePath)}" (Error: ${response.status}).`);
                }
                setDownloadingMaterialId(null);
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                setDownloadError(`"${getFileName(material.filePath)}" appears to be unavailable or corrupted.`);
                setDownloadingMaterialId(null);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = getFileName(material.filePath);
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
                setDownloadError(`Cannot connect to download server for "${getFileName(material.filePath)}".`);
            } else {
                setDownloadError(`An unexpected error occurred while downloading "${getFileName(material.filePath)}".`);
            }
        }
    };

    const isVideoAvailable = () => {
        if (!lesson?.videoUrl) return false;

        const trimmedUrl = lesson.videoUrl.trim();
        if (!trimmedUrl) return false;

        const invalidValues = ["null", "undefined", "N/A", "none", "#", ""];
        if (invalidValues.includes(trimmedUrl.toLowerCase())) {
            return false;
        }

        return true;
    };

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                onLogout={handleLogout}
                showHome={true}
                showCourses={true}
                showProfile={true}
            />

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
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

                {/* Loading State */}
                {isLoading ? (
                    <LoadingState message="Loading lesson..." />
                ) : (
                    <>
                        <BackButton onClick={() => navigate(`/courses/${courseId}`)} />

                        <LessonHeader title={lesson?.title} />

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content Column */}
                            <div className="lg:col-span-2 space-y-8">
                                <VideoPlayer
                                    videoUrl={lesson?.videoUrl}
                                    title={lesson?.title}
                                    isAvailable={isVideoAvailable()}
                                />

                                <LessonContent content={lesson?.content} />
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                <SidebarCard icon={Download} title="Materials">
                                    <MaterialsList
                                        materials={materials}
                                        onDownload={handleMaterialDownload}
                                    />
                                </SidebarCard>

                                <SidebarCard icon={HelpCircle} title="Quizzes" iconColor="text-amber-400">
                                    <QuizzesList
                                        quizzes={quizzes}
                                        onQuizClick={handleQuizClick}
                                    />
                                </SidebarCard>
                            </div>
                        </div>
                    </>
                )}

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default LessonPage;