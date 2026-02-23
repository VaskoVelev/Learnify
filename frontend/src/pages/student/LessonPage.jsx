import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLesson } from "../../api/lesson.api";
import { getLessonMaterials } from "../../api/material.api";
import { getLessonQuizzes } from "../../api/quiz.api";
import { getMyQuizSubmissions } from "../../api/submission.api";
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
} from "../../components";
import { getFileName, isValidFileUrl, getFileDownloadError, isVideoAvailable } from "../../utils";

const LessonPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const [lesson, setLesson] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [quizSubmissions, setQuizSubmissions] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadError, setDownloadError] = useState(null);
    const [downloadingMaterialId, setDownloadingMaterialId] = useState(null);

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

            if (quizzesData.length > 0) {
                const submissionsMap = {};
                await Promise.all(
                    quizzesData.map(async (quiz) => {
                        try {
                            const submissions = await getMyQuizSubmissions(quiz.id);
                            submissionsMap[quiz.id] = submissions.length > 0;
                        } catch (err) {
                            setError(err.message);
                            submissionsMap[quiz.id] = false;
                        }
                    })
                );
                setQuizSubmissions(submissionsMap);
            }
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
                setDownloadError(`Cannot connect to download server for "${getFileName(material.filePath)}".`);
            } else {
                setDownloadError(`An unexpected error occurred while downloading "${getFileName(material.filePath)}".`);
            }
        }
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

                {isLoading ? (
                    <LoadingState message="Loading, wait a sec..." />
                ) : (
                    <>
                        {/* Navigation back to course */}
                        <BackButton
                            onClick={() => navigate(`/courses/${courseId}`)}
                            text="Back to Course"
                        />

                        {/* Lesson title header */}
                        <LessonHeader title={lesson?.title} />

                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Left column - Main lesson content */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Video player */}
                                <VideoPlayer
                                    videoUrl={lesson?.videoUrl}
                                    title={lesson?.title}
                                    isAvailable={isVideoAvailable(lesson?.videoUrl)}
                                />

                                {/* Text content */}
                                <LessonContent content={lesson?.content} />
                            </div>

                            {/* Right column - Sidebar with materials and quizzes */}
                            <div className="lg:col-span-1 space-y-6">

                                {/* Downloadable materials */}
                                <MaterialsList
                                    materials={materials}
                                    onDownload={handleMaterialDownload}
                                />

                                {/* Quiz list with completion status */}
                                <QuizzesList
                                    quizzes={quizzes}
                                    onQuizClick={handleQuizClick}
                                    quizSubmissions={quizSubmissions}
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

export default LessonPage;