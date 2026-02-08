import React from "react";

const AuthInput = React.forwardRef(({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    icon: Icon,
    error = null,
    disabled = false,
    className = "",
    iconClassName = "",
    ...props
}, ref) => {
    const inputStyle = "w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all";

    return (
        <div className="w-full">
            <div className="relative">
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 ${iconClassName}`} />
                )}
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        ${inputStyle}
                        ${Icon ? 'pl-12' : ''}
                        ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : ''}
                        ${className}
                    `}
                    {...props}
                />
            </div>
        </div>
    );
});

AuthInput.displayName = "AuthInput";

export default AuthInput;