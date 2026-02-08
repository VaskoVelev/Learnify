const FieldError = ({ error, className = "" }) => {
    if (!error) {
        return null;
    }

    return (
        <p className={`mt-1 text-sm text-red-400 ${className}`}>
            {error}
        </p>
    );
};

export default FieldError;