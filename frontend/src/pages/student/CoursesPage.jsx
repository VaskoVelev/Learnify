import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllCourses } from "../../api/course.api";
import { enrollInCourse } from "../../api/enrollment.api";
import {
    GraduationCap,
    Home,
    User,
    LogOut,
    BookOpen,
    Search,
    Filter,
    Calendar,
    ChevronDown,
    CheckCircle,
    Clock,
    Tag,
    TrendingUp,
    Award,
    Calculator,
    FlaskConical,
    Atom,
    History,
    Languages,
    BookText,
    Cpu,
    Briefcase,
    Music,
    BarChart3,
    Loader2,
    X,
    AlertCircle,
    Check,
    Sparkles,
    Users
} from "lucide-react";

const CoursesPage = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [enrollSuccess, setEnrollSuccess] = useState(null);
    const [enrollingCourseId, setEnrollingCourseId] = useState(null);
    const [expandedCourseId, setExpandedCourseId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");

    const categoryIcons = {
        MATH: <Calculator className="w-4 h-4" />,
        CHEMISTRY: <FlaskConical className="w-4 h-4" />,
        PHYSICS: <Atom className="w-4 h-4" />,
        HISTORY: <History className="w-4 h-4" />,
        LANGUAGE: <Languages className="w-4 h-4" />,
        LITERATURE: <BookText className="w-4 h-4" />,
        IT: <Cpu className="w-4 h-4" />,
        BUSINESS: <Briefcase className="w-4 h-4" />,
        MUSIC: <Music className="w-4 h-4" />
    };

    const allCategories = [
        "all", "MATH", "CHEMISTRY", "PHYSICS", "HISTORY", "LANGUAGE",
        "LITERATURE", "IT", "BUSINESS", "MUSIC"
    ];

    const allDifficulties = [
        "all", "BEGINNER", "EASY", "INTERMEDIATE", "ADVANCED", "EXPERT"
    ];

    const difficultyColors = {
        BEGINNER: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
        EASY: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
        INTERMEDIATE: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
        ADVANCED: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
        EXPERT: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30" },
    };

    const categoryColors = {
        MATH: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
        CHEMISTRY: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
        PHYSICS: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" },
        HISTORY: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
        LANGUAGE: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/30" },
        LITERATURE: { bg: "bg-violet-500/20", text: "text-violet-400", border: "border-violet-500/30" },
        IT: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
        BUSINESS: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
        MUSIC: { bg: "bg-rose-500/20", text: "text-rose-400", border: "border-rose-500/30" },
    };

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const coursesData = await getAllCourses();

            setCourses(coursesData);
            setFilteredCourses(coursesData);
        } catch (err) {
            setError(err.message);
            setCourses([]);
            setFilteredCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const filterCourses = () => {
        let filtered = courses;

        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(course =>
                course.category === selectedCategory
            );
        }

        if (selectedDifficulty !== "all") {
            filtered = filtered.filter(course =>
                course.difficulty === selectedDifficulty
            );
        }

        setFilteredCourses(filtered);
    };

    useEffect(() => {
        filterCourses();
    }, [courses, searchTerm, selectedCategory, selectedDifficulty]);


    const handleEnroll = async (courseId, courseTitle) => {
        try {
            setEnrollingCourseId(courseId);
            setError(null);
            setEnrollSuccess(null);

            await enrollInCourse(courseId);
            setEnrollSuccess(`Successfully enrolled in "${courseTitle}"`);

            fetchCourses();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnrollingCourseId(null);
        }
    };

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

    useEffect(() => {
        if (searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all") {
            setEnrollSuccess(null);
            setError(null);
        }
    }, [searchTerm, selectedCategory, selectedDifficulty]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedDifficulty("all");
    };

    const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all";

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case "BEGINNER": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
            case "EASY": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/20";
            case "INTERMEDIATE": return "bg-amber-500/20 text-amber-400 border-amber-500/20";
            case "ADVANCED": return "bg-rose-500/20 text-rose-400 border-rose-500/20";
            case "EXPERT": return "bg-purple-500/20 text-purple-400 border-purple-500/20";
            default: return "bg-white/10 text-white/60 border-white/10";
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
                    <Link to="/" className="flex items-center gap-3 group">
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
                {/* Welcome Section - Updated for Courses Page */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                                    <span className="text-xs font-medium text-teal-400">Course Catalog</span>
                                </div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
                                Explore <span
                                className="bg-clip-text text-transparent"
                                style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 56%) 0%, hsl(199, 89%, 58%) 100%)" }}
                            >All Courses</span>
                            </h1>
                            <p className="text-white/60 text-base sm:text-lg max-w-xl">
                                Discover and enroll in courses to expand your knowledge and skills.
                            </p>
                        </div>

                        {/* Quick Stats Card - Updated with Book Icon */}
                        <div
                            className="flex-none sm:w-36 p-4 rounded-2xl border border-white/10 backdrop-blur-xl"
                            style={{ background: "linear-gradient(145deg, hsla(174, 70%, 40%, 0.15) 0%, hsla(174, 70%, 40%, 0.05) 100%)" }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-teal-400" />
                                <span className="text-xs text-white/50 uppercase tracking-wide">Courses</span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold text-white">{filteredCourses.length}</p>
                        </div>
                    </div>
                </div>

                {/* Messages Display */}
                <div className="space-y-4 mb-6">
                    {enrollSuccess && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                            <p className="text-emerald-400 text-sm">{enrollSuccess}</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-xl flex items-center justify-center gap-3 animate-in slide-in-from-top duration-300">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="mb-8 flex flex-col lg:flex-row gap-4">
                    {/* Search Bar - Updated with icon in container */}
                    <div className="flex-1">
                        <div className="relative">
                            <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Search className="w-4 h-4 text-teal-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses by title or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-white/40" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3">
                        {/* Category Filter */}
                        <div className="relative">
                            <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                <Tag className="w-4 h-4 text-teal-400" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-transparent text-white/80 focus:outline-none cursor-pointer appearance-none pr-6"
                                >
                                    <option value="all" className="bg-gray-900 text-white">All Categories</option>
                                    {allCategories.filter(cat => cat !== "all").map((category) => (
                                        <option key={category} value={category} className="bg-gray-900 text-white">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-white/40 absolute right-3" />
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div className="relative">
                            <div className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl">
                                <BarChart3 className="w-4 h-4 text-cyan-400" />
                                <select
                                    value={selectedDifficulty}
                                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                                    className="bg-transparent text-white/80 focus:outline-none cursor-pointer appearance-none pr-6"
                                >
                                    <option value="all" className="bg-gray-900 text-white">All Difficulties</option>
                                    {allDifficulties.filter(diff => diff !== "all").map((difficulty) => (
                                        <option key={difficulty} value={difficulty} className="bg-gray-900 text-white">
                                            {difficulty}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-white/40 absolute right-3" />
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/15 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                <span>Clear</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* All Courses Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                <BookOpen className="w-5 h-5 text-teal-400" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-white">Available Courses</h2>
                        </div>
                    </div>

                    {/* Courses Grid */}
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
                            <p className="text-white/60 mt-4">Loading, wait a sec...</p>
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 items-start">
                            {filteredCourses.map((course) => {
                                const isExpanded = expandedCourseId === course.id;
                                const isEnrolling = enrollingCourseId === course.id;
                                const catColor = categoryColors[course.category] || { bg: "bg-white/10", text: "text-white/60", border: "border-white/20" };

                                return (
                                    <div
                                        key={course.id}
                                        onMouseEnter={() => setExpandedCourseId(course.id)}
                                        onMouseLeave={() => setExpandedCourseId(null)}
                                        className="group relative rounded-2xl border border-white/10 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-teal-500/40"
                                        style={{
                                            background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                                        }}
                                    >
                                        {/* Card glow effect on hover */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                             style={{ background: "radial-gradient(circle at 50% 0%, hsla(174, 72%, 46%, 0.1) 0%, transparent 70%)" }}
                                        />

                                        <div className="p-5 sm:p-6">
                                            {/* Course icon */}
                                            <div className="relative flex items-start justify-between mb-5">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-teal-500/30 blur-xl rounded-full group-hover:bg-teal-500/40 transition-colors" />
                                                    <div className={`relative p-3.5 rounded-xl ${catColor.bg} ${catColor.text} border ${catColor.border}`}>
                                                        {categoryIcons[course.category] || <BookOpen className="w-5 h-5 text-teal-400" />}
                                                    </div>
                                                </div>

                                                {/* Difficulty badge */}
                                                <div className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getDifficultyColor(course.difficulty)}`}>
                                                    {course.difficulty}
                                                </div>
                                            </div>

                                            {/* Course title */}
                                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-teal-400 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>

                                            {/* Category */}
                                            <div className="flex items-center gap-1.5 text-xs text-white/50 mb-2">
                                                <Tag className="w-3 h-3" />
                                                <span>{course.category}</span>
                                            </div>

                                            {/* Updated date */}
                                            <div className="flex items-center gap-1.5 text-xs text-white/40 mb-4">
                                                <Calendar className="w-3 h-3" />
                                                <span>Updated {formatDate(course.updatedAt)}</span>
                                            </div>

                                            {/* Learn More section */}
                                            <div className="pt-4 border-t border-white/5">
                                                <div className="flex items-center justify-between text-sm cursor-pointer">
                                                    <span className="text-white/50">Learn more</span>
                                                    <ChevronDown className={`w-4 h-4 text-teal-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>

                                                {/* Expandable content - FIXED: Only this course will expand */}
                                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                                    <p className="text-white/60 text-sm mb-4 leading-relaxed">
                                                        {course.description}
                                                    </p>

                                                    {/* Created date */}
                                                    <div className="flex items-center gap-2 text-xs text-white/40 mb-4">
                                                        <Clock className="w-3 h-3" />
                                                        <span>Created {formatDate(course.createdAt)}</span>
                                                    </div>

                                                    {course.isEnrolled ? (
                                                        <div className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all ${
                                                            enrollSuccess && enrollSuccess.includes(course.title)
                                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                                : 'bg-white/5 text-white/60 border border-white/10'
                                                        }`}>
                                                            <Check className="w-4 h-4" />
                                                            <span>{enrollSuccess && enrollSuccess.includes(course.title) ? 'Enrolled Successfully!' : 'Already Enrolled'}</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEnroll(course.id, course.title);
                                                            }}
                                                            disabled={isEnrolling}
                                                            className="w-full py-3 px-6 rounded-xl font-semibold text-gray-900 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                            style={{
                                                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                                                boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)"
                                                            }}
                                                        >
                                                            {isEnrolling ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    Enrolling...
                                                                </>
                                                            ) : (
                                                                "Enroll Now"
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            className="p-12 sm:p-16 rounded-2xl border border-white/10 text-center backdrop-blur-xl relative overflow-hidden"
                            style={{
                                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
                            }}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-teal-500/10 blur-3xl rounded-full" />
                            <div className="relative">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Search className="w-10 h-10 text-white/30" />
                                </div>
                                <h3 className="text-2xl font-semibold text-white mb-3">No courses found</h3>
                                <p className="text-white/60 mb-6 max-w-sm mx-auto">
                                    {hasActiveFilters
                                        ? "Try adjusting your search or filters to find what you're looking for."
                                        : "There are no courses available at the moment. Please check back later."}
                                </p>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-all"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Footer section */}
                <footer className="relative z-10 border-t border-white/10 mt-12">
                    <div className="max-w-7xl mx-auto px-6 py-8">
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
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default CoursesPage;
