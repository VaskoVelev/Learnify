const PageHeader = ({ title, subtitle, className = "" }) => {
    return (
        <div className={`mb-10 ${className}`}>
            <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
            <p className="text-white/60 text-lg">{subtitle}</p>
        </div>
    );
};

export default PageHeader;