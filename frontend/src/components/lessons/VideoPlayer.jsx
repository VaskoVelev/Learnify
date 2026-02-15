import { Play, XCircle } from "lucide-react";
import { getYouTubeVideoId } from "../../utils";

const VideoPlayer = ({ videoUrl, title, isAvailable }) => {
    return (
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

            {isAvailable ? (
                <div className="aspect-video">
                    {(() => {
                        const videoId = getYouTubeVideoId(videoUrl);
                        if (videoId) {
                            return (
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={title}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    referrerPolicy="strict-origin-when-cross-origin"
                                />
                            );
                        } else {
                            return (
                                <iframe
                                    src={videoUrl}
                                    title={title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            );
                        }
                    })()}
                </div>
            ) : (
                <div className="aspect-video flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">Video Not Available</h4>
                    <p className="text-white/60 max-w-md">
                        The video lesson for this content is currently unavailable.
                        Please check back later or contact support if this issue persists.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;