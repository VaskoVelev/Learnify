export const normalizeError = (error) => {
    if (!error.response) {
        return {
            message: "Cannot connect to server. Please check your internet.",
            errors: {},
        };
    }

    const { status, data } = error.response;

    let result = {
        message: "An unexpected error occurred.",
        errors: {},
    };

    if (status === 400) {
        if (data.error) {
            result.message = data.error;
        } else {
            result.message = "Please correct the errors below.";
            result.errors = data;
        }
    } else if (status === 401) {
        result.message = "Invalid email or password.";
    } else if (status === 403) {
        result.message = "Access denied (Account disabled or forbidden).";
    } else if (status === 404) {
        result.message = "Resource not found.";
    } else if (status >= 500) {
        result.message = "Server error. Please try again later.";
    }

    return result;
};
