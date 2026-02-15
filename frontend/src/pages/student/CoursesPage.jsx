import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllCourses } from "../../api/course.api";
import { enrollInCourse } from "../../api/enrollment.api";
import {
    Navbar,
    Footer,
    GradientBackground,
    FloatingOrbs,
    GlobalError,
    LoadingState,
    EmptyState,
    WelcomeBadge,
    StatsCard,
    SectionHeader,
    SearchBar,
    FilterDropdown,
    ClearFiltersButton,
    CourseCatalogCard,
    WelcomeSection
} from "../../components";
import { BookOpen, Sparkles, Tag, BarChart3 } from "lucide-react";
import { ALL_CATEGORIES, ALL_DIFFICULTIES } from "../../constants";

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

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setSelectedDifficulty("all");
    };

    const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedDifficulty !== "all";

    return (
        <GradientBackground>
            <FloatingOrbs />

            <Navbar
                user={null}
                onLogout={handleLogout}
                showHome={true}
                showCourses={false}
                showProfile={true}
            />

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 lg:py-12">
                {/* Welcome Section - Updated for Courses Page */}
                <div className="mb-8 lg:mb-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <WelcomeBadge
                                text="Course Catalog"
                                icon={Sparkles}
                                className="mb-3"
                            />

                            <WelcomeSection
                                coloredText="All Courses"
                                title="Explore"
                                subtitle="Discover and enroll in courses to expand your knowledge and skills."
                            />
                        </div>

                        <StatsCard
                            icon={BookOpen}
                            label="Courses"
                            value={filteredCourses.length}
                            color="teal"
                            gradient="linear-gradient(145deg, hsla(174, 70%, 40%, 0.15) 0%, hsla(174, 70%, 40%, 0.05) 100%)"
                            className="flex-none sm:w-36"
                        />
                    </div>
                </div>

                {/* Messages Display */}
                <div className="space-y-4 mb-6">
                    <GlobalError
                        error={enrollSuccess}
                        onDismiss={() => setEnrollSuccess(null)}
                        type="success"
                    />

                    <GlobalError
                        error={error}
                        onDismiss={() => setError(null)}
                        type="error"
                    />
                </div>

                {/* Search and Filters */}
                <div className="mb-8 flex flex-col lg:flex-row gap-4">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Search courses by title or description..."
                    />

                    {/* Filters */}
                    <div className="flex gap-3">
                        <FilterDropdown
                            icon={Tag}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={ALL_CATEGORIES}
                            placeholder="All Categories"
                            iconColor="text-teal-400"
                        />

                        <FilterDropdown
                            icon={BarChart3}
                            value={selectedDifficulty}
                            onChange={setSelectedDifficulty}
                            options={ALL_DIFFICULTIES}
                            placeholder="All Difficulties"
                            iconColor="text-cyan-400"
                        />

                        {hasActiveFilters && (
                            <ClearFiltersButton onClick={clearFilters} />
                        )}
                    </div>
                </div>

                {/* All Courses Section */}
                <section>
                    <SectionHeader
                        icon={BookOpen}
                        title="Available Courses"
                    />

                    {/* Courses Grid */}
                    {isLoading ? (
                        <LoadingState message="Loading courses..." />
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 items-start">
                            {filteredCourses.map((course) => (
                                <CourseCatalogCard
                                    key={course.id}
                                    course={course}
                                    onEnroll={handleEnroll}
                                    isExpanded={expandedCourseId === course.id}
                                    onMouseEnter={() => setExpandedCourseId(course.id)}
                                    onMouseLeave={() => setExpandedCourseId(null)}
                                    isEnrolling={enrollingCourseId === course.id}
                                    enrollSuccess={enrollSuccess?.includes(course.title)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={BookOpen}
                            title="No courses found"
                            description={hasActiveFilters
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "There are no courses available at the moment. Please check back later."}
                            actionText={hasActiveFilters ? "Clear Filters" : undefined}
                            onActionClick={hasActiveFilters ? clearFilters : undefined}
                        />
                    )}
                </section>

                <Footer />
            </main>
        </GradientBackground>
    );
};

export default CoursesPage;