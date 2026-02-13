import { BarChart3 } from "lucide-react";

const ProgressCard = ({ progress }) => {
    return (
        <div
            className="rounded-2xl border border-white/10 backdrop-blur-xl p-6"
            style={{
                background: "linear-gradient(145deg, hsla(0, 0%, 100%, 0.08) 0%, hsla(0, 0%, 100%, 0.02) 100%)",
            }}
        >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Your Progress
            </h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/60">Completion</span>
                        <span className="text-white font-medium">{progress?.progressPercent || 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress?.progressPercent || 0}%`,
                                background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressCard;