import circle from "../assets/circle.mp4";

export default function GreetingSection() {
  const userName = "Mathew";
  const managerName = "Viswa";

  return (
    <div className="mb-6 md:mb-10 w-full max-w-4xl text-center">
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto mb-4 md:mb-6">
        <video
          src={circle}
          className="w-full h-full rounded-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
      <h1 className=" font-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight text-center mb-1 sm:mb-2">
        Good Morning, {userName}
      </h1>
      <p className=" font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight text-center mb-1 sm:mb-2">
        I'm your manager {managerName}
      </p>
      <p className=" font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl leading-tight tracking-tight text-center">
        What's on <span className="text-purple-600">your</span>{" "}
        <span className="text-pink-500">mind</span>
        <span className="text-orange-400">?</span>
      </p>
    </div>
  );
}
