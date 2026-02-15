import { AlertCircle } from "lucide-react";

const SubmitButton = ({ allAnswered, onSubmit, isSubmitting = false }) => {
    return (
        <div className="mt-8 flex items-center justify-between">
            {!allAnswered && (
                <div className="flex items-center gap-2 text-amber-400/80 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Please answer all questions before submitting.
                </div>
            )}
            <div className="ml-auto">
                <button
                    onClick={onSubmit}
                    disabled={!allAnswered || isSubmitting}
                    className="px-8 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        background: allAnswered && !isSubmitting
                            ? "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)"
                            : "hsla(0, 0%, 100%, 0.1)",
                        boxShadow: allAnswered && !isSubmitting ? "0 0 30px hsla(174, 72%, 46%, 0.3)" : "none",
                    }}
                >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
            </div>
        </div>
    );
};

export default SubmitButton;