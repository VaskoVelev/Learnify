import { User, Save, X } from "lucide-react";
import { FieldError } from "../../components";

const ProfileForm = ({ form, fieldErrors, isSaving, onChange, onSubmit, onCancel }) => {
    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all duration-300";

    return (
        <form onSubmit={onSubmit} className="p-8">
            <div className="space-y-6">
                {/* First Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={onChange}
                            className={`${inputStyle} pl-12 ${fieldErrors?.firstName ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="Enter your first name"
                            disabled={isSaving}
                        />
                    </div>
                    <FieldError error={fieldErrors?.firstName} />
                </div>

                {/* Last Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={onChange}
                            className={`${inputStyle} pl-12 ${fieldErrors?.lastName ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}`}
                            placeholder="Enter your last name"
                            disabled={isSaving}
                        />
                    </div>
                    <FieldError error={fieldErrors?.lastName} />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-white/10">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    style={{
                        background: "linear-gradient(135deg, hsl(174, 72%, 46%) 0%, hsl(199, 89%, 48%) 100%)",
                        boxShadow: "0 0 30px hsla(174, 72%, 46%, 0.25)",
                    }}
                >
                    {isSaving ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Changes
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-white/70 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ProfileForm;