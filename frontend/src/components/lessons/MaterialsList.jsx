import { useState } from "react";
import { Download, AlertCircle, Search, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";
import {
    getFileName,
    getFileIcon,
    getFileTypeLabel,
    isValidFileUrl
} from "../../utils";

const MaterialsList = ({ materials, onDownload, showAddButton = false, onAddClick }) => {
    const [downloadingId, setDownloadingId] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleDownload = async (material) => {
        setDownloadingId(material.id);
        await onDownload(material);
        setDownloadingId(null);
    };

    if (materials.length === 0) {
        return (
            <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-teal-500/20">
                            <Download className="w-5 h-5 text-teal-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">Materials</h3>
                    </div>
                    {showAddButton && (
                        <button
                            onClick={onAddClick}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Material
                        </button>
                    )}
                </div>
                <div className="text-center py-8">
                    <Download className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No materials available</p>
                </div>
            </div>
        );
    }

    const hasMoreThanThree = materials.length > 3;

    // Get the materials to display based on expanded state
    const displayedMaterials = isExpanded ? materials : materials.slice(0, 3);

    // Filter based on search term (only when expanded)
    const filteredMaterials = searchTerm && isExpanded
        ? displayedMaterials.filter(material =>
            getFileName(material?.filePath).toLowerCase().includes(searchTerm.toLowerCase())
        )
        : displayedMaterials;

    return (
        <div className="rounded-2xl border border-white/10 backdrop-blur-xl p-6">
            {/* Header with add button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-500/20">
                        <Download className="w-5 h-5 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Materials</h3>
                </div>
                {showAddButton && (
                    <button
                        onClick={onAddClick}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Material
                    </button>
                )}
            </div>

            {/* Search Bar - only show when expanded */}
            {isExpanded && hasMoreThanThree && (
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/30 text-sm"
                    />
                </div>
            )}

            {/* Materials List */}
            <div className={`space-y-2 ${isExpanded ? 'max-h-[300px] overflow-y-auto custom-scrollbar pr-2' : ''}`}>
                {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((material) => {
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
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-500/15 text-teal-400 relative shrink-0">
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
                                    <div className="text-teal-400 shrink-0">
                                        <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <Download className={`w-4 h-4 shrink-0 transition-all ${
                                        isValid ? 'text-white/40 group-hover:text-teal-400 group-hover:translate-y-0.5' : 'text-red-400/50'
                                    }`} />
                                )}
                            </button>
                        );
                    })
                ) : (
                    <div className="text-center py-4">
                        <p className="text-white/40 text-sm">No materials match your search</p>
                    </div>
                )}
            </div>

            {/* Show More/Less Button */}
            {hasMoreThanThree && (
                <button
                    onClick={() => {
                        setIsExpanded(!isExpanded);
                        setSearchTerm("");
                    }}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Show Less
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show All {materials.length} Materials
                        </>
                    )}
                </button>
            )}

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default MaterialsList;