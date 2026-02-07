import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getLesson } from "../../api/lesson.api";
import { getLessonMaterials } from "../../api/material.api";
import { getLessonQuizzes } from "../../api/quiz.api";
import {
    GraduationCap,
    Home,
    User,
    LogOut,
    BookOpen,
    Play,
    FileText,
    FileImage,
    Film,
    File,
    HelpCircle,
    ChevronRight,
    Download,
    AlertCircle,
    Sparkles,
    XCircle,
    CheckCircle
} from "lucide-react";

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

    const getFileIcon = (fileType) => {
        switch (fileType?.toLowerCase()) {
            case "pdf":
            case "doc":
            case "docx":
                return <FileText className="w-5 h-5" />;
            case "png":
            case "jpg":
            case "jpeg":
                return <FileImage className="w-5 h-5" />;
            case "mp4":
                return <Film className="w-5 h-5" />;
            default:
                return <File className="w-5 h-5" />;
        }
    };

    const getFileName = (filePath) => {
        return filePath?.split("/").pop();
    };

    const getFileTypeLabel = (fileType) => {
        return fileType?.toUpperCase();
    };

    const isVideoAvailable = () => {
        if (!lesson?.videoUrl) return false;

        const trimmedUrl = lesson.videoUrl.trim();
        if (!trimmedUrl) return false;

        if (trimmedUrl === "null" ||
            trimmedUrl === "undefined" ||
            trimmedUrl === "N/A" ||
            trimmedUrl === "none") {
            return false;
        }

        return true;
    };

    const handleMaterialDownload = async (material) => {
        if (!material?.filePath) {
            setDownloadError("Download link is not available for this material.");
            return;
        }

        setDownloadingMaterialId(material.id);
        setDownloadError(null);

        try {
            const response = await fetch(material.filePath, { method: 'HEAD' });

            if (!response.ok) {
                setError(`Unable to download "${getFileName(material.filePath)}".`);
            }

            const link = document.createElement('a');
            link.href = material.filePath;
            link.download = getFileName(material.filePath);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadingMaterialId(null);

        } catch (err) {
            setDownloadingMaterialId(null);
            setDownloadError(`Unable to download "${getFileName(material.filePath)}".`);
        }
    };

    return (
        <div
            className="min-h-screen"
            style={{ background: "linear-gradient(135deg, hsl(220, 30%, 8%) 0%, hsl(220, 25%, 15%) 50%, hsl(200, 30%, 12%) 100%)" }}
        >
            {/* Floating orbs */}
            <div className="fixed w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-15 -top-32 -left-32 pointer-events-none" />
            <div className="fixed w-80 h-80 bg-cyan-500 rounded-full blur-[100px] opacity-15 bottom-20 right-10 pointer-events-none" />
            <div className="fixed w-64 h-64 bg-teal-400 rounded-full blur-[80px] opacity-10 top-1/2 left-1/3 pointer-events-none" />
            <div className="fixed w-48 h-48 bg-blue-500 rounded-full blur-[60px] opacity-10 top-1/4 right-1/4 pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/home" className="flex items-center gap-3 group">
                        <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 group-hover:bg-white/15 group-hover:border-teal-500/30 transition-all duration-300">
                            <GraduationCap className="w-6 h-6 text-teal-400" />
                        </div>
                        <span className="text-2xl font-bold text-white">
                            Learn<span
                            className="bg-clip-text text-transparent"
                            style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)" }}
                        >ify</span>
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1 sm:gap-2">
                        <Link
                            to="/home"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        <Link
                            to="/courses"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            <span className="hidden sm:inline">Courses</span>
                        </Link>
                        <Link
                            to="/profile"
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-3 sm:px-4 py-2.5 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Download Error Display */}
                {downloadError && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <p className="text-amber-400 text-sm">{downloadError}</p>
                        <button
                            onClick={() => setDownloadError(null)}
                            className="ml-auto text-amber-400 hover:text-amber-300"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div
                        className="p-12 rounded-2xl border border-white/10 text-center backdrop-blur-xl"
                        style={{
                            background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                        }}
                    >
                        <div className="flex justify-center">
                            <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white/60 mt-4">Loading lesson...</p>
                    </div>
                ) : lesson ? (
                    <>
                        {/* Back Link */}
                        <div className="mb-8">
                            <button
                                onClick={() => navigate(`/courses/${courseId}`)}
                                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                Back to Course
                            </button>
                        </div>

                        {/* Lesson Header */}
                        <div
                            className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden mb-8"
                            style={{
                                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                            }}
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                                        <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                                        <span className="text-xs font-medium text-teal-400">Lesson Details</span>
                                    </div>
                                </div>

                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                                    {lesson.title}
                                </h1>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Main Content Column */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Video Section */}
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <div className="p-6 border-b border-white/10">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <Play className="w-5 h-5 text-teal-400" />
                                            Video Lesson
                                        </h3>
                                    </div>

                                    {isVideoAvailable() ? (
                                        <div className="aspect-video">
                                            <iframe
                                                src={lesson.videoUrl}
                                                title={lesson.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
                                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                                <XCircle className="w-8 h-8 text-red-400" />
                                            </div>
                                            <h4 className="text-xl font-semibold text-white mb-2">Video Not Available</h4>
                                            <p className="text-white/60 max-w-md">
                                                The video lesson for this content is currently unavailable.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-teal-400" />
                                        Lesson Content
                                    </h3>
                                    <div className="prose prose-invert max-w-none">
                                        {lesson.content?.split("\n\n").map((paragraph, index) => (
                                            <p key={index} className="text-white/70 leading-relaxed mb-4 whitespace-pre-line">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Materials Section */}
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <Download className="w-5 h-5 text-teal-400" />
                                        Materials
                                    </h3>
                                    <div className="space-y-2">
                                        {materials.length > 0 ? (
                                            materials.map((material) => (
                                                <button
                                                    key={material.id}
                                                    onClick={() => handleMaterialDownload(material)}
                                                    disabled={downloadingMaterialId === material.id}
                                                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-500/15 text-teal-400">
                                                        {downloadingMaterialId === material.id ? (
                                                            <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            getFileIcon(material.fileType)
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white/80 text-sm truncate group-hover:text-white transition-colors">
                                                            {getFileName(material.filePath)}
                                                        </p>
                                                        <p className="text-white/40 text-xs">
                                                            {getFileTypeLabel(material.fileType)}
                                                        </p>
                                                    </div>
                                                    {downloadingMaterialId === material.id ? (
                                                        <div className="text-teal-400">
                                                            <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                                                        </div>
                                                    ) : (
                                                        <Download className="w-4 h-4 text-white/40 group-hover:text-teal-400 group-hover:translate-y-0.5 transition-all" />
                                                    )}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                                <FileText className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                                <p className="text-white/60 text-sm">No materials available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quizzes Section */}
                                <div
                                    className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
                                    style={{
                                        background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                    }}
                                >
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-amber-400" />
                                        Quizzes
                                    </h3>
                                    <div className="space-y-3">
                                        {quizzes.length > 0 ? (
                                            quizzes.map((quiz) => (
                                                <button
                                                    key={quiz.id}
                                                    onClick={() => handleQuizClick(quiz.id)}
                                                    className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all group"
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex-1">
                                                            <h4 className="text-white font-medium group-hover:text-amber-400 transition-colors">
                                                                {quiz.title}
                                                            </h4>
                                                            <p className="text-white/50 text-sm mt-1">
                                                                {quiz.description}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-amber-400 group-hover:translate-x-1 transition-all mt-1" />
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                                <HelpCircle className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                                <p className="text-white/60 text-sm">No quizzes available</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Fallback when lesson is null after loading */
                    <div
                        className="p-12 rounded-2xl border border-white/10 text-center backdrop-blur-xl"
                        style={{
                            background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                        }}
                    >
                        <div className="flex justify-center">
                            <AlertCircle className="w-12 h-12 text-red-400" />
                        </div>
                        <p className="text-white text-lg mt-4">Unable to load lesson data</p>
                        <button
                            onClick={() => navigate(`/courses/${courseId}`)}
                            className="mt-4 inline-flex items-center gap-2 py-2.5 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)"
                            }}
                        >
                            Back to Course
                        </button>
                    </div>
                )}

                {/* Footer section */}
                <footer className="relative z-10 border-t border-white/10 mt-12 pt-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-teal-400" />
                            <span className="text-white/60 text-sm">
                                © 2026 Learnify. Keep learning, keep growing.
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                Help Center
                            </a>
                            <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-white/40 hover:text-white/80 text-sm transition-colors">
                                Privacy
                            </a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default LessonPage;
