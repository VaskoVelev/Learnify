export const normalizeError = (error) => {
    if (!error.response) {
        return {
            type: "NETWORK",
            message: "Cannot connect to server",
        };
    }

    const { status, data } = error.response;

    return {
        type: "HTTP",
        status,
        message:
            data?.message ||
            data?.error ||
            "Something went wrong",
        errors: data?.errors || null,
    };
};
