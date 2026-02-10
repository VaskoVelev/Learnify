const LoadingState = ({ message = "Loading, wait a sec...", className = "" }) => {
    return (
        <div
            className={`p-12 rounded-2xl border border-white/10 text-center backdrop-blur-xl ${className}`}
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <div className="flex justify-center">
                <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-white/60 mt-4">{message}</p>
        </div>
    );
};

export default LoadingState;