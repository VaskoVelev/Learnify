const FloatingOrbs = () => {
    return (
        <>
            <div className="fixed w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-15 -top-32 -left-32 pointer-events-none" />
            <div className="fixed w-80 h-80 bg-cyan-500 rounded-full blur-[100px] opacity-15 bottom-20 right-10 pointer-events-none" />
            <div className="fixed w-64 h-64 bg-teal-400 rounded-full blur-[80px] opacity-10 top-1/2 left-1/3 pointer-events-none" />
            <div className="fixed w-48 h-48 bg-blue-500 rounded-full blur-[60px] opacity-10 top-1/4 right-1/4 pointer-events-none" />
        </>
    );
};

export default FloatingOrbs;