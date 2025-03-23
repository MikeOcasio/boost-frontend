const BackgroundPattern = () => {
  return (
    // <div
    //   className="fixed top-0 left-0 w-full h-full bg-repeat bg-contain opacity-30 blur-[2px] -z-20"
    //   style={{
    //     backgroundImage: 'url("/images/pattern-3.png")',
    //     backgroundRepeat: "repeat",
    //     backgroundSize: "600px 600px",
    //   }}
    // />
    <div
      className="fixed top-0 left-0 w-full h-full bg-cover opacity-50 blur-md -z-20"
      style={{
        backgroundImage: 'url("/images/pattern-3.png")',
      }}
    />
  );
};

export default BackgroundPattern;
