import { useNavigate } from "react-router-dom";
import { Shield, Home, ArrowLeft } from "lucide-react";
import {
    GradientBackground,
    FloatingOrbs
} from "../components";

const ForbiddenPage = () => {
    const navigate = useNavigate();

    return (
        <GradientBackground>
            <FloatingOrbs />

            <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
                <div className="max-w-2xl w-full text-center">
                    {/* Shield icon */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-rose-500/30 blur-3xl rounded-full animate-pulse" />
                        <div className="relative flex justify-center">
                            <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 flex items-center justify-center backdrop-blur-xl animate-bounce">
                                <Shield className="w-16 h-16 text-rose-400" />
                            </div>
                        </div>
                    </div>

                    {/* Error code */}
                    <h1 className="text-8xl sm:text-9xl font-bold text-white mb-4 animate-in slide-in-from-top duration-500">
                        403
                    </h1>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 animate-in slide-in-from-top duration-500 delay-100">
                        Access Forbidden
                    </h2>

                    {/* Description */}
                    <p className="text-white/60 text-lg mb-8 max-w-md mx-auto animate-in slide-in-from-top duration-500 delay-200">
                        You don't have permission to access this page. 
                        This area is restricted to authorized users only.
                    </p>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-top duration-500 delay-300">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/home")}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                                boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.3)"
                            }}
                        >
                            <Home className="w-4 h-4" />
                            Go to Home
                        </button>
                    </div>

                    {/* Help text */}
                    <p className="text-white/30 text-sm mt-8 animate-in fade-in duration-500 delay-500">
                        If you believe this is a mistake, please contact your administrator.
                    </p>
                </div>
            </div>
        </GradientBackground>
    );
};

export default ForbiddenPage;