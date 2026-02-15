export const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

export const getProgressBadgeColor = (progress) => {
    if (progress >= 80) {
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20';
    }

    if (progress >= 40) {
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/20';
    }

    return 'bg-white/10 text-white/60 border border-white/10';
};