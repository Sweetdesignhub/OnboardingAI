import { useState, useRef } from "react";
import { BsStars } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { MdOutlineMicNone } from "react-icons/md";
import { IoMdArrowUp } from "react-icons/io";
import MicOverlay from "./MicOverlay";
import circle from "../assets/circle.mp4";
import voice from "../assets/voice.gif";

export default function ChatFooter() {
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]); // Store selected files in state
  const fileInputRef = useRef(null); // Reference to the file input element

  const handleMicClick = () => {
    setIsMicOpen(true);
  };

  const handleCloseMic = () => {
    setIsMicOpen(false);
  };

  const handleAttachClick = () => {
    // Trigger the file input when the "Attach" button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Convert the FileList to an array and update the state
      setSelectedFiles(Array.from(files));
    }
  };

  return (
    <>
      <footer className="p-2 sm:p-3 md:p-4 flex justify-center mt-auto">
        <div className="w-full max-w-4xl bg-white border border-gray-300 rounded-lg p-2 sm:p-3 md:p-4 shadow-md">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <BsStars className="text-2xl sm:text-3xl md:text-4xl" />
            <input
              type="text"
              placeholder="Ask me anything...."
              className="flex-1 py-1 px-2 md:px-3 outline-none text-black text-xs sm:text-sm md:text-base"
            />
          </div>
          <div className="flex justify-between items-center">
            <div
              className="flex items-center border border-gray-300 rounded px-2 py-1 space-x-1 sm:space-x-2 cursor-pointer"
              onClick={handleAttachClick} // Trigger file input click
            >
              <GrAttachment className="text-2xl" />
              <span className="text-xs sm:text-sm text-black">Attach</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                className="border border-gray-300 rounded p-1 sm:p-1.5 md:p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                onClick={handleMicClick}
              >
                <MdOutlineMicNone className="text-xl sm:text-xl md:text-xl" />
              </button>
              <button className="border border-gray-300 rounded p-1 sm:p-1.5 md:p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
                <IoMdArrowUp className="text-xl sm:text-xl md:text-xl" />
              </button>
            </div>
          </div>
          {/* Display the names of the selected files */}
          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm text-gray-700 font-semibold">
                Selected Files:
              </h4>
              <ul className="text-xs sm:text-sm text-black">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-1"
                  >
                    <span>{file.name}</span> {/* Display the file name */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </footer>

      {/* File input element, hidden from view */}
      <input
        type="file"
        ref={fileInputRef} // Attach the reference
        style={{ display: "none" }} // Hide the file input
        onChange={handleFileChange} // Handle file selection
        multiple // Optional: allows multiple files to be selected
      />

      {/* Mic Overlay Component */}
      <MicOverlay
        isOpen={isMicOpen}
        onClose={handleCloseMic}
        circleVideoSrc={circle}
        voiceGifSrc={voice}
      />
    </>
  );
}
