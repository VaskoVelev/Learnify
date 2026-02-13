import { useState } from "react";
import { Download, FileText, FileImage, Film, File, AlertCircle } from "lucide-react";

const MaterialsList = ({ materials, onDownload }) => {
    const [downloadingId, setDownloadingId] = useState(null);

    const getFileIcon = (fileType) => {
        switch (fileType?.toLowerCase()) {
            case "pdf":
            case "docx":
                return <FileText className="w-5 h-5" />;
            case "png":
            case "jpg":
            case "jpeg":
                return <FileImage className="w-5 h-5" />;
            case "mp4":
                return <Film className="w-5 h-5" />;
            default:
                return <File className="w-5 h-5" />;
        }
    };

    const getFileName = (filePath) => {
        try {
            const url = new URL(filePath);
            const pathname = url.pathname;
            const fileName = pathname.split('/').pop();
            return fileName || 'document';
        } catch {
            const parts = filePath.split(/[\\/]/);
            const lastPart = parts.pop();
            return lastPart || 'document';
        }
    };

    const getFileTypeLabel = (fileType) => {
        return fileType?.toUpperCase();
    };

    const isValidFileUrl = (filePath) => {
        try {
            const url = new URL(filePath);
            return ['http:', 'https:'].includes(url.protocol);
        } catch {
            return false;
        }
    };

    const handleDownload = async (material) => {
        setDownloadingId(material.id);
        await onDownload(material);
        setDownloadingId(null);
    };

    if (materials.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <FileText className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/60 text-sm">No materials available</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {materials.map((material) => {
                const isValid = isValidFileUrl(material?.filePath);
                const fileName = getFileName(material?.filePath);
                const isDownloading = downloadingId === material?.id;

                return (
                    <button
                        key={material?.id}
                        onClick={() => handleDownload(material)}
                        disabled={isDownloading || !isValid}
                        className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-teal-500/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!isValid ? `Invalid URL: ${material?.filePath}` : `Download ${fileName}`}
                    >
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-500/15 text-teal-400 relative">
                            {isDownloading ? (
                                <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    {getFileIcon(material?.fileType)}
                                    {!isValid && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                            <AlertCircle className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white/80 text-sm truncate group-hover:text-white transition-colors">
                                {fileName}
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-white/40 text-xs">
                                    {getFileTypeLabel(material?.fileType)}
                                </p>
                                {!isValid && (
                                    <span className="text-red-400 text-xs">Invalid URL</span>
                                )}
                            </div>
                        </div>
                        {isDownloading ? (
                            <div className="text-teal-400">
                                <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <Download className={`w-4 h-4 transition-all ${
                                isValid ? 'text-white/40 group-hover:text-teal-400 group-hover:translate-y-0.5' : 'text-red-400/50'
                            }`} />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default MaterialsList;