import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Здравей{user?.firstName ? `, ${user.firstName}` : ""} 👋
                </h1>

                <p className="text-gray-600 mb-6">
                    Успешно си логнат в системата.
                </p>

                <button
                    onClick={logout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    Изход
                </button>
            </div>
        </div>
    );
};

export default HomePage;
