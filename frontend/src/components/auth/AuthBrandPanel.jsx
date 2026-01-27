import { GraduationCap, BookOpen, Users } from "lucide-react";

const AuthBrandPanel = () => {
    return (
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
            {/* Floating orbs */}
            <div className="absolute w-96 h-96 bg-teal-500 rounded-full blur-3xl opacity-30 -top-20 -left-20 animate-pulse" />
            <div className="absolute w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-30 bottom-20 right-10 animate-pulse" />
            <div className="absolute w-48 h-48 bg-teal-400 rounded-full blur-3xl opacity-30 top-1/3 right-1/4 animate-pulse" />

            <div className="relative z-10 text-center max-w-lg">
                <div className="flex justify-center mb-8">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <GraduationCap className="w-16 h-16 text-teal-400" />
                    </div>
                </div>

                <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
                    Learn<span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)" }}>ify</span>
                </h1>

                <p className="text-xl text-white/70 mb-12 leading-relaxed">
                    Unlock your potential with world-class courses from industry experts
                </p>

                {/* Feature cards */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-semibold">1000+ Courses</h3>
                            <p className="text-white/60 text-sm">Learn anything, from anywhere</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                        <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-semibold">Expert Instructors</h3>
                            <p className="text-white/60 text-sm">Learn from the best in the industry</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthBrandPanel;
