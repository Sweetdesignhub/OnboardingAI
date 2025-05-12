import jnjLogo from "../assets/jnj.png";
import { BsStars } from "react-icons/bs";
import { FaAngleDown, FaUserCircle } from "react-icons/fa";
import { MdLiveHelp, MdOutlineSettings } from "react-icons/md";

export default function Header() {
  return (
    <header className="p-3 sm:p-4 flex justify-between items-center border-b border-gray-300 shadow-md">
      <div className="flex items-center space-x-2 sm:space-x-15">
        <img
          src={jnjLogo}
          alt="J&J Logo"
          className="h-8 sm:h-10 md:h-12 w-auto cursor-pointer"
        />
        <div className="flex items-center border border-gray-300 rounded px-2 py-1 space-x-1 sm:space-x-2 cursor-pointer">
          <BsStars className="text-xs sm:text-sm md:text-base" />
          <span className="text-xs sm:text-sm font-medium text-gray-700">
            Version 4.0
          </span>
          <FaAngleDown className="text-xs sm:text-sm md:text-base" />
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
        <MdOutlineSettings className="text-base sm:text-lg md:text-xl cursor-pointer" />
        <MdLiveHelp className="text-base sm:text-lg md:text-xl cursor-pointer" />
        <FaUserCircle className="text-base sm:text-lg md:text-xl cursor-pointer" />
      </div>
    </header>
  );
}
