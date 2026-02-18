import { useState } from "react";
import { Save, X, PlusCircle, Trash2, AlertCircle, HelpCircle } from "lucide-react";

const QuestionForm = ({
    form,
    onTextChange,
    onAnswersChange,
    onSubmit,
    onCancel,
    isSubmitting = false,
    onDeleteAnswer, // Add this prop for handling answer deletion
    submitButtonText = "Create Question",
    loadingText = "Creating Question..."
}) => {
    const [answerError, setAnswerError] = useState("");

    // Check if form is valid
    const isFormValid = () => {
        // Question text must be filled
        if (!form.text.trim()) return false;

        // Must have at least 2 answers
        if (form.answers.length < 2) return false;

        // All answers must have text
        const allAnswersHaveText = form.answers.every(a => a.text.trim() !== "");
        if (!allAnswersHaveText) return false;

        // Exactly one answer must be correct
        const correctCount = form.answers.filter(a => a.isCorrect).length;
        if (correctCount !== 1) return false;

        return true;
    };

    const isValid = isFormValid();

    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300";
    const labelStyle = "block text-sm font-medium text-gray-400 mb-2";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValid) {
            onSubmit();
        }
    };

    const addAnswer = () => {
        if (form.answers.length >= 4) {
            setAnswerError("Maximum 4 answers allowed");
            return;
        }
        // New answers have no ID (they will be created in the database)
        const newAnswers = [...form.answers, { text: "", isCorrect: false }];
        onAnswersChange(newAnswers);
        setAnswerError("");
    };

    const removeAnswer = (index) => {
        if (form.answers.length <= 2) {
            setAnswerError("Minimum 2 answers required");
            return;
        }

        const answerToDelete = form.answers[index];

        // If this answer has an ID (existing answer in edit mode), call the delete API
        if (answerToDelete.id && onDeleteAnswer) {
            onDeleteAnswer(answerToDelete.id);
        }
        // If it doesn't have an ID (new answer), just remove it from state

        const newAnswers = form.answers.filter((_, i) => i !== index);
        onAnswersChange(newAnswers);
        setAnswerError("");
    };

    const updateAnswerText = (index, text) => {
        const newAnswers = [...form.answers];
        newAnswers[index].text = text;
        onAnswersChange(newAnswers);
    };

    const setCorrectAnswer = (index) => {
        const newAnswers = form.answers.map((answer, i) => ({
            ...answer,
            isCorrect: i === index
        }));
        onAnswersChange(newAnswers);
    };

    const letters = ["A", "B", "C", "D"];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text - Required */}
            <div>
                <label className={labelStyle}>
                    Question Text <span className="text-rose-400">*</span>
                </label>
                <textarea
                    name="text"
                    value={form.text}
                    onChange={onTextChange}
                    placeholder="e.g., What does HTML stand for?"
                    rows="3"
                    className={`${inputStyle} resize-none`}
                    disabled={isSubmitting}
                />
            </div>

            {/* Answers Section */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className={labelStyle}>
                        Answers <span className="text-rose-400">*</span>
                    </label>
                    <span className="text-xs text-white/40">
                        {form.answers.length}/4 answers
                    </span>
                </div>

                <div className="space-y-3">
                    {form.answers.map((answer, index) => (
                        <div key={answer.id || `new-${index}`} className="flex items-start gap-3">
                            {/* Answer input */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={answer.text}
                                    onChange={(e) => updateAnswerText(index, e.target.value)}
                                    placeholder={`Answer ${letters[index]}`}
                                    className={`${inputStyle} ${!answer.text.trim() && form.answers.length >= 2 ? 'border-amber-500/50' : ''}`}
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* Correct answer radio */}
                            <button
                                type="button"
                                onClick={() => setCorrectAnswer(index)}
                                className={`flex-shrink-0 px-3 py-3 rounded-xl transition-all ${
                                    answer.isCorrect
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10 hover:text-white/60'
                                }`}
                                title="Mark as correct answer"
                                disabled={isSubmitting}
                            >
                                {answer.isCorrect ? '✓ Correct' : '○ Set as correct'}
                            </button>

                            {/* Remove answer button */}
                            <button
                                type="button"
                                onClick={() => removeAnswer(index)}
                                className="flex-shrink-0 p-3 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all border border-rose-500/30"
                                title="Remove answer"
                                disabled={isSubmitting || form.answers.length <= 2}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add answer button */}
                {form.answers.length < 4 && (
                    <button
                        type="button"
                        onClick={addAnswer}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-all text-sm font-medium border border-teal-500/30"
                        disabled={isSubmitting}
                    >
                        <PlusCircle className="w-4 h-4" />
                        Add Answer
                    </button>
                )}

                {/* Answer validation messages */}
                {answerError && (
                    <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <p className="text-amber-400 text-sm">{answerError}</p>
                    </div>
                )}

                {form.answers.length < 2 && (
                    <div className="flex items-center gap-2 mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <p className="text-amber-400 text-sm">
                            Minimum 2 answers required
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                        background: !isValid
                            ? "linear-gradient(135deg, hsl(0, 84%, 60%) 0%, hsl(0, 84%, 50%) 100%)"
                            : "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                        boxShadow: isValid ? "0 0 30px hsla(174, 72%, 46%, 0.25)" : "0 0 30px hsla(0, 84%, 60%, 0.25)",
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
                            {!isValid ? "Fill Required Fields" : submitButtonText}
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

export default QuestionForm;