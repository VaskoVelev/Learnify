export const getYouTubeVideoId = (url) => {
    if (!url) {
        return null;
    }

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }

    return null;
};

export const isVideoAvailable = (videoUrl) => {
    if (!videoUrl) {
        return false;
    }

    const trimmedUrl = videoUrl.trim();
    if (!trimmedUrl) {
        return false;
    }

    const invalidValues = ["null", "undefined", "N/A", "none", "#", ""];
    if (invalidValues.includes(trimmedUrl.toLowerCase())) {
        return false;
    }

    return true;
};