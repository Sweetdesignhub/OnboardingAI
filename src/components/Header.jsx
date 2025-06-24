import { Link, useLocation } from "react-router-dom"; // Import useLocation to track the current route
import { BsStars } from "react-icons/bs";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import { MdLiveHelp, MdOutlineSettings } from "react-icons/md";

export default function Header() {
  const location = useLocation(); // Get the current route location

  return (
    <header className="h-15 p-3 sm:p-4 flex justify-between items-center border-b border-gray-300 shadow-md">
      <div className="flex items-center space-x-2 sm:space-x-15">
        <h1 className="font-semibold text-[22px] leading-[150%] align-middle tracking-[0%]">
          {/* Onboard Genie */}
          Onboarding Jobie
        </h1>
        {/* <div className="flex items-center border border-gray-300 rounded px-2 py-1 space-x-1 sm:space-x-2 cursor-pointer">
          <BsStars className="text-xs sm:text-sm md:text-base" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Version 4.0
          </span>
          <FaAngleDown className="text-xs sm:text-sm md:text-base" />
        </div> */}
      </div>

      {/* Middle section with tabs */}
      <div className="flex items-center space-x-12 sm:space-x-14 md:space-x-16">
        <Link
          to="/dashboard"
          className={`font-medium text-lg py-4 leading-[150%] tracking-none text-center cursor-pointer ${
            location.pathname === "/dashboard"
              ? "border-b-4 border-[#EB1700]"
              : ""
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/chatAvatar"
          className={`font-medium text-lg py-4 leading-[150%] tracking-none text-center cursor-pointer ${
            location.pathname === "/chatAvatar"
              ? "border-b-4 border-[#EB1700]"
              : ""
          }`}
        >
          Jobie Agent
        </Link>
        <Link
          to="/documents"
          className={`font-medium text-lg py-4 leading-[150%] tracking-none text-center cursor-pointer ${
            location.pathname === "/documents"
              ? "border-b-4 border-[#EB1700]"
              : ""
          }`}
        >
          Document Hub
        </Link>
        <Link
          to="/training"
          className={`font-medium text-lg py-4 leading-[150%] tracking-none text-center cursor-pointer ${
            location.pathname === "/training"
              ? "border-b-4 border-[#EB1700]"
              : ""
          }`}
        >
          Training
        </Link>
      </div>

      {/* Right section with icons */}
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
        <MdOutlineSettings className="text-base sm:text-lg md:text-xl cursor-pointer" />
        <MdLiveHelp className="text-base sm:text-lg md:text-xl cursor-pointer" />
        <FaUserCircle className="text-base sm:text-lg md:text-xl cursor-pointer" />
      </div>
    </header>
  );
}
