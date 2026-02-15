export const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};