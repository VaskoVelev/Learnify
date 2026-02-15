import { FileText, FileImage, Film, File } from "lucide-react";

export const getFileName = (filePath) => {
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

export const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
        case "pdf":
        case "doc":
        case "docx":
            return <FileText className="w-5 h-5" />;
        case "png":
        case "jpg":
        case "jpeg":
            return <FileImage className="w-5 h-5" />;
        case "mp4":
        case "mov":
            return <Film className="w-5 h-5" />;
        default:
            return <File className="w-5 h-5" />;
    }
};

export const getFileTypeLabel = (fileType) => {
    return fileType?.toUpperCase();
};

export const isValidFileUrl = (filePath) => {
    const url = new URL(filePath);
    return ['http:', 'https:'].includes(url.protocol);
};

export const getFileDownloadError = (fileName, status) => {
    if (status === 404) {
        return `"${fileName}" was not found on the server.`;
    }

    if (status === 403) {
        return `You don't have permission to download "${fileName}".`;
    }

    if (status >= 500) {
        return `Server error while downloading "${fileName}".`;
    }

    return `Unable to download "${fileName}" (Error: ${status}).`;
};