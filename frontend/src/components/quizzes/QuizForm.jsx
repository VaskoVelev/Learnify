import { useState } from "react";
import { HelpCircle, Save, X, AlertCircle } from "lucide-react";

const QuizForm = ({
    form,
    onTitleChange,
    onDescriptionChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    submitButtonText = "Create Quiz",
    loadingText = "Creating Quiz..."
}) => {
    const isFormValid = form.title.trim() !== "";

    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300";
    const labelStyle = "block text-sm font-medium text-gray-400 mb-2";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className={labelStyle}>
                    Quiz Title <span className="text-rose-400">*</span>
                </label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={onTitleChange}
                    placeholder="e.g., HTML Basics Quiz"
                    className={inputStyle}
                    disabled={isSubmitting}
                />
            </div>

            {/* Description */}
            <div>
                <label className={labelStyle}>Description (optional)</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={onDescriptionChange}
                    placeholder="Describe what this quiz covers and what students will be tested on..."
                    rows="5"
                    className={`${inputStyle} resize-none`}
                    disabled={isSubmitting}
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

export default QuizForm;