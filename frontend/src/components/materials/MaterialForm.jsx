import { useState } from "react";
import { FileText, Save, X, Link, Film, Image, AlertCircle } from "lucide-react";
import { FilterDropdown } from "../../components";

const MaterialForm = ({
    form,
    onFilePathChange,
    onFileTypeChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitButtonText = "Create Material",
    loadingText = "Creating Material..."
}) => {
    const [urlError, setUrlError] = useState("");

    const isFormValid = form.filePath.trim() !== "" && form.fileType !== "";

    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300";
    const labelStyle = "block text-sm font-medium text-gray-400 mb-2";

    const fileTypes = [
        "PDF", "DOC", "DOCX", "PNG", "JPG", "JPEG", "MP4", "MOV"
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit();
        }
    };

    const validateUrl = (url) => {
        if (url && !url.match(/^(http|https):\/\/[^ "]+$/)) {
            setUrlError("Please enter a valid URL (including http:// or https://)");
        } else {
            setUrlError("");
        }
    };

    const getFileTypeIcon = () => {
        const type = form.fileType?.toLowerCase();
        if (!type) return FileText;
        if (type === 'png' || type === 'jpg' || type === 'jpeg') {
            return Image;
        }
        if (type === 'mp4' || type === 'mov') {
            return Film;
        }
        return FileText;
    };

    const IconComponent = getFileTypeIcon();

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Path */}
            <div>
                <label className={labelStyle}>
                    File URL <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="url"
                        name="filePath"
                        value={form.filePath}
                        onChange={onFilePathChange}
                        onBlur={(e) => validateUrl(e.target.value)}
                        placeholder="https://example.com/files/document.pdf"
                        className={`${inputStyle} pl-12 ${urlError ? 'border-amber-500/50' : ''}`}
                        disabled={isSubmitting}
                    />
                </div>
                {urlError && (
                    <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-amber-400" />
                        <p className="text-amber-400 text-xs">{urlError}</p>
                    </div>
                )}
                <p className="text-white/30 text-xs mt-1">
                    Enter the full URL where the file is hosted
                </p>
            </div>

            {/* File Type */}
            <div>
                <label className={labelStyle}>
                    File Type <span className="text-rose-400">*</span>
                </label>
                <FilterDropdown
                    icon={IconComponent}
                    value={form.fileType}
                    onChange={onFileTypeChange}
                    options={fileTypes}
                    placeholder="Select file type"
                    iconColor={form.fileType ? "text-teal-400" : "text-white/30"}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                        background: !isFormValid
                            ? "linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 84%, 50%) 100%)"
                            : "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                        boxShadow: isFormValid ? "0 0 30px hsla(174, 72%, 46%, 0.25)" : "0 0 30px hsla(0, 84%, 60%, 0.25)",
                    }}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {loadingText}
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            {!isFormValid ? "Fill Required Fields" : submitButtonText}
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default MaterialForm;