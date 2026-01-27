import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";

const Index = () => {
    return (
        <div className="auth-container items-center justify-center">
            <div className="floating-orb w-96 h-96 bg-primary -top-20 -left-20" />
            <div className="floating-orb w-64 h-64 bg-cyan-500 bottom-20 right-10" />
            <div className="floating-orb w-48 h-48 bg-teal-400 top-1/3 right-1/4" />

            <div className="relative z-10 text-center max-w-2xl px-6 animate-fade-in">
                <div className="flex justify-center mb-8">
                    <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 animate-float">
                        <GraduationCap className="w-20 h-20 text-primary" />
                    </div>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Learn<span className="text-gradient">ify</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
                    The modern platform for online learning.
                    Master new skills with expert-led courses.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/login"
                        className="auth-button inline-flex items-center justify-center gap-2 !w-auto px-8"
                    >
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        to="/register"
                        className="py-3.5 px-8 rounded-xl font-semibold border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Index;
